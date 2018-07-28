import Sprite from '../base/sprite'
import Animation from '../base/animation'
import DataBus  from '../databus'

let {GRID_LENGTH} = require('src/js/utils').default

// 玩家相关常量设置
const PLAYER_IMG_SRC = 'images/hero.png'

let databus = new DataBus()

export default class Robot extends Sprite {
  constructor(properties, position) {
    super('images/' + properties.icon, GRID_LENGTH, GRID_LENGTH, position[0], position[1])

    Object.assign(this, properties)

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
