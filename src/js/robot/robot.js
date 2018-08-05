import Sprite from '../base/sprite'
import Animation from '../base/animation'
import DataBus from '../databus'
import { isBoolean } from 'util';

let {GRID_LENGTH, getLen} = require('src/js/utils').default

const ROBOT_TYPE = {
  PLAYER: 0,
  ENEMY: 1,
  NPC: 2
}

let databus = new DataBus()

export default class Robot extends Sprite {
  constructor(properties, position, type = ROBOT_TYPE.PLAYER) {
    super('images/' + properties.icon, GRID_LENGTH, GRID_LENGTH, getLen(position[0]), getLen(position[1]))

    this.posX = position[0]
    this.posY = position[1]

    this.type = type

    this._showMoveRange = false
    // 标识是否移动
    this._isMove = false
    this.movePosX = this.PosX
    this.movePosY = this.PosY

    Object.assign(this, properties)
    // 战时状态
    this.wartime = {
      LV: 1,
      anger: 100,
      HP: this.HP - 1000,
      EN: this.EN - 50,
      canMove: true,
      canAttack: true, // todo: 能否攻击的判断
      canTransform: !!this.abilities['transform'],
      canSpirit: true
    }
    

  }
  
  drawToCanvas(ctx) {
    super.drawToCanvas(ctx)
    // console.log(this._showMoveRange)
    if (this._showMoveRange) {
      ctx.fillStyle = 'rgba(0, 127, 255, 0.5)'
      ctx.beginPath()
      this.drawRange(ctx, this.move, this.x, this.y)
      for (let k in databus.players) {
        let x = getLen(k[0]), y = getLen(k[2])
        if (ctx.isPointInPath(x + GRID_LENGTH / 2, y + GRID_LENGTH / 2)) {
          ctx.rect(x, y, GRID_LENGTH, GRID_LENGTH)
        }
      }
      for (let k in databus.enemys) {
        let x = getLen(k[0]), y = getLen(k[2])
        if (ctx.isPointInPath(x + GRID_LENGTH / 2, y + GRID_LENGTH / 2)) {
          ctx.rect(x, y, GRID_LENGTH, GRID_LENGTH)
        }
      }
      ctx.closePath()
      ctx.fill('evenodd')
    }
  }
  drawMoveRange(ctx, num, x, y, posX, posY) {
    if (--num < 0) {
      return
    }
    let flags = {
      top: true,
      left: true,
      right: true,
      bottom: true,
    }
    let keyTop = `${posX}_${posY - 1}`
    let keyLeft = `${posX - 1}_${posY}`
    let keyRight = `${posX + 1}_${posY}`
    let keyBottom = `${posX}_${posY + 1}`
    flags.top = !Boolean(databus.players[keyTop] || databus.enemys[keyTop])
    flags.left = !Boolean(databus.players[keyLeft] || databus.enemys[keyLeft])
    flags.right = !Boolean(databus.players[keyRight] || databus.enemys[keyRight])
    flags.bottom = !Boolean(databus.players[keyBottom] || databus.enemys[keyBottom])
    // databus.mapInfo[keyTop] && (flags.top = databus.mapInfo[keyTop]['move'])
    if (flags.top) {
      ctx.moveTo(x, y)
      ctx.lineTo(x, y - GRID_LENGTH)
      ctx.lineTo(x + GRID_LENGTH, y - GRID_LENGTH)
      ctx.lineTo(x + GRID_LENGTH, y)
      ctx.lineTo(x, y)
      this.drawMoveRange(ctx, num, x, y - GRID_LENGTH, posX, posY - 1)
    }
    if (flags.left) {
      ctx.moveTo(x, y)
      ctx.lineTo(x - GRID_LENGTH, y)
      ctx.lineTo(x - GRID_LENGTH, y + GRID_LENGTH)
      ctx.lineTo(x, y + GRID_LENGTH)
      ctx.lineTo(x, y)
      this.drawMoveRange(ctx, num, x - GRID_LENGTH, y, posX - 1, posY)
    }
    if (flags.right) {
      ctx.moveTo(x + GRID_LENGTH, y)
      ctx.lineTo(x + GRID_LENGTH * 2, y)
      ctx.lineTo(x + GRID_LENGTH * 2, y + GRID_LENGTH)
      ctx.lineTo(x + GRID_LENGTH, y + GRID_LENGTH)
      ctx.lineTo(x + GRID_LENGTH, y)
      this.drawMoveRange(ctx, num, x + GRID_LENGTH, y, posX + 1, posY)
    }
    if (flags.bottom) {
      ctx.moveTo(x, y + GRID_LENGTH)
      ctx.lineTo(x + GRID_LENGTH, y + GRID_LENGTH)
      ctx.lineTo(x + GRID_LENGTH, y + GRID_LENGTH * 2)
      ctx.lineTo(x, y + GRID_LENGTH * 2)
      ctx.lineTo(x, y + GRID_LENGTH)
      this.drawMoveRange(ctx, num, x, y + GRID_LENGTH, posX, posY + 1)
    }
  }

  showMoveRange(flag = true) {
    // console.log('showMoveRange: ', flag)
    this._showMoveRange = flag
    return this
  }
  update() {
    if (this._isMove) {
      const speed = 8
      let speedX = this.movePosX > this.posX ? speed : -1 * speed
      let speedY = this.movePosY > this.posY ? speed : -1 * speed
      if (this.x == getLen(this.movePosX)) {
        this.y += speedY
      } else {
        this.x += speedX
      }
      if (this.y == getLen(this.movePosY)) {
        this._isMove = false
      }
    }
  }
  doMove(posX, posY) {
    this._isMove = true
    this.movePosX = posX
    this.movePosY = posY
  }

  showAttackRange() {

  }
  attack() {

  }

  playExplosionAnimation() {
    let frames = []

    const EXPLO_IMG_PREFIX  = 'images/explosion'
    const EXPLO_FRAME_COUNT = 19

    for ( let i = 0;i < EXPLO_FRAME_COUNT;i++ ) {
      frames.push(EXPLO_IMG_PREFIX + (i + 1) + '.png')
    }
    console.log(this.x, this.y)
    let ani = new Animation('', this.width, this.height, this.x, this.y)
    .initFrames(frames)
    .playAnimation()
    
    setTimeout(ani.playAnimation, 1000)
  }
  /**
   * 菱形的范围绘制函数
   * @param {object} ctx 
   * @param {number} num 范围大小
   * @param {number} x 中心点横坐标
   * @param {number} y 中心点纵坐标
   */
  drawRange(ctx, num, x, y) {
    ctx.moveTo(x, y - num * GRID_LENGTH)
    for(let i = 0; i <= num; i++) {
      ctx.lineTo(x + GRID_LENGTH * (i + 1), y - num * GRID_LENGTH + GRID_LENGTH * i)
      ctx.lineTo(x + GRID_LENGTH * (i + 1), y - num * GRID_LENGTH + GRID_LENGTH * (i + 1))
    }
    for(let i = 0; i < num; i++) {
      ctx.lineTo(x + GRID_LENGTH * (num - i), y + (i + 1) * GRID_LENGTH)
      ctx.lineTo(x + GRID_LENGTH * (num - i), y + (i + 2) * GRID_LENGTH)
    }
    for(let i = 0; i <= num; i++) {
      ctx.lineTo(x - GRID_LENGTH * i, y + (num + 1) * GRID_LENGTH - GRID_LENGTH * i)
      ctx.lineTo(x - GRID_LENGTH * i, y + (num + 1) * GRID_LENGTH - GRID_LENGTH * (i + 1))
    }
    for(let i = 0; i < num; i++) {
      ctx.lineTo(x - GRID_LENGTH * (num - i - 1), y - i * GRID_LENGTH)
      ctx.lineTo(x - GRID_LENGTH * (num - i - 1), y - (i + 1) * GRID_LENGTH)
    }
  }
}
