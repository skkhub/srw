import Sprite from '../base/sprite'
import Animation from '../base/animation'

let {GRID_LENGTH, getLen} = require('src/js/utils').default

const ROBOT_TYPE = {
  PLAYER: 0,
  ENEMY: 1,
  NPC: 2
}

export default class Robot extends Sprite {
  constructor(properties, position, type = ROBOT_TYPE.PLAYER) {
    super('images/' + properties.icon, GRID_LENGTH, GRID_LENGTH, getLen(position[0]), getLen(position[1]))

    this.posX = position[0]
    this.posY = position[1]

    this.type = type

    Object.assign(this, properties)
    // 战时状态
    this.wartime = {
      HP: this.HP,
      EN: this.EN,
      canMove: true,
      canAttack: true, // todo: 能否攻击的判断
      canTransform: !!this.abilities['transform'],
      canSpirit: true
    }
    

  }

  showMoveRange() {

  }
  move() {

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

}
