import Animation from '../base/animation'
import DataBus  from '../databus'

// 玩家相关常量设置
const PLAYER_IMG_SRC = 'images/hero.png'
const PLAYER_WIDTH   = 64
const PLAYER_HEIGHT  = 64

let databus = new DataBus()

export default class Robot extends Animation {
  constructor(imgSrc, x, y) {
    super(imgSrc, 64, 64, x, y)

    this.initExplosionAnimation()
  }

  showMoveRange() {

  }
  move() {

  }

  showAttackRange() {

  }
  attack() {

  }

  initExplosionAnimation() {
    console.log('init')
    let frames = []

    const EXPLO_IMG_PREFIX  = 'images/explosion'
    const EXPLO_FRAME_COUNT = 19

    for ( let i = 0;i < EXPLO_FRAME_COUNT;i++ ) {
      frames.push(EXPLO_IMG_PREFIX + (i + 1) + '.png')
    }

    this.initFrames(frames)
  }

}
