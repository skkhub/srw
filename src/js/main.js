import Player from './player/index'
import Robot from './robot/robot'
import Enemy from './npc/enemy'
import BackGround from './runtime/background'
import GameInfo from './runtime/gameinfo'
import Music from './runtime/music'
import DataBus from './databus'
import Event from './runtime/event'
import {selectRobotById} from './data/dbi'
let {SCREEN_WIDTH, SCREEN_HEIGHT} = require('src/js/utils').default

const canvas = document.getElementById('canvas')
const offscreenCanvas = document.createElement('canvas')
offscreenCanvas.width = canvas.width = SCREEN_WIDTH
offscreenCanvas.height = canvas.height = SCREEN_HEIGHT

const ctx = offscreenCanvas.getContext('2d')
const mainCtx = canvas.getContext('2d')
// const ctx = canvas.getContext('2d')
ctx.textBaseline = 'middle'

let databus = new DataBus()

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // this.restart()
  }

  restart() {

    // this.loadData()
    // this.renderBg()
    // this.generateRobot()
    // this.bindEvent()

    let mission = require('./data/missions')

    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )
    databus.initMapInfo(mission.bgInfo.grid)
    this.robotGenerate(mission)
    this.bg = new BackGround(ctx, mission.bgInfo)
    // this.player = new Robot('images/hero.png', 2, 2)
    this.gameinfo = new GameInfo()
    // this.music = new Music()
    this.evt = new Event(canvas, ctx, mission.bgInfo.mapWidth, mission.bgInfo.mapHeight)
    // debugger
    // databus.reset()
    // this.music.playBgm()
    // this.player.playExplosionAnimation()
    window.requestAnimationFrame(
      this.loop.bind(this),
      canvas
    )
  }
  /**
   * robot生成逻辑
   */
  robotGenerate(data) {
    let {players, enemys} = data

    players.forEach(item => {
      let robotData = selectRobotById(item.id)
      // databus.players.push(new Robot(robotData, item.position, 0))
      let k = `${item.position[0]}_${item.position[1]}`
      databus.players[k] = new Robot(robotData, item.position, 0)
    })
    
    enemys.forEach(item => {
      let robotData = selectRobotById(item.id)
      // databus.enemys.push(new Robot(robotData, item.position, 1))
      let k = `${item.position[0]}_${item.position[1]}`
      databus.enemys[k] = new Robot(robotData, item.position, 0)
    })
    // databus.updateRobotMapInfo()
  }
  /**
   * 随着帧数变化的敌机生成逻辑
   * 帧数取模定义成生成的频率
   */
  enemyGenerate() {
    if (databus.frame % 30 === 0) {
      let enemy = databus.pool.getItemByClass('enemy', Enemy)
      enemy.init(1)
      databus.enemys.push(enemy)
    }
  }

  // 全局碰撞检测
  collisionDetection() {
    let that = this

    databus.bullets.forEach((bullet) => {
      for (let i = 0, il = databus.enemys.length; i < il; i++) {
        let enemy = databus.enemys[i]

        if (!enemy.isPlaying && enemy.isCollideWith(bullet)) {
          enemy.playAnimation()
          that.music.playExplosion()

          bullet.visible = false
          databus.score += 1

          break
        }
      }
    })

    for (let i = 0, il = databus.enemys.length; i < il; i++) {
      let enemy = databus.enemys[i]

      if (this.player.isCollideWith(enemy)) {
        databus.gameOver = true

        break
      }
    }
  }

  //游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
    e.preventDefault()

    let x = e.touches[0].clientX
    let y = e.touches[0].clientY

    let area = this.gameinfo.btnArea

    if (x >= area.startX
      && x <= area.endX
      && y >= area.startY
      && y <= area.endY)
      this.restart()
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    ctx.clearRect(-this.evt.translateX, -this.evt.translateY, SCREEN_WIDTH, SCREEN_HEIGHT)
    mainCtx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)

    this.bg.render(ctx)

    for (let k in databus.players) {
      databus.players[k].drawToCanvas(ctx)
    }
    for (let k in databus.enemys) {
      databus.enemys[k].drawToCanvas(ctx)
    }
    // this.player.drawToCanvas(ctx)
    databus.animations.forEach((ani) => {
      if (ani.isPlaying) {
        ani.aniRender(ctx)
      }
    })
    this.evt.drawToCanvas()

    this.gameinfo.renderGameScore(ctx, databus.score)

    mainCtx.drawImage(offscreenCanvas, 0, 0)
  }

  // 游戏逻辑更新主函数
  update() {
    // this.bg.update()

    // databus.bullets
    //   .concat(databus.enemys)
    //   .forEach((item) => {
    //     item.update()
    //   })

    // this.enemyGenerate()

    // this.collisionDetection()
    for (let k in databus.players) {
      databus.players[k].update()
    }
    for (let k in databus.enemys) {
      databus.enemys[k].update()
    }
  }

  // 实现游戏帧循环
  loop() {
    databus.frame++

    this.update()
    this.render()

    if (databus.frame % 20 === 0) {
      // this.player.shoot()
      // this.music.playShoot()
    }

    // 游戏结束停止帧循环
    if (databus.gameOver) {
      this.gameinfo.renderGameOver(ctx, databus.score)
      mainCtx.drawImage(offscreenCanvas, 0, 0)
      this.music.stopAllMusic()

      this.touchHandler = this.touchEventHandler.bind(this)
      canvas.addEventListener('touchstart', this.touchHandler)

      return
    }

    window.requestAnimationFrame(
      this.loop.bind(this),
      canvas
    )
  }
}
