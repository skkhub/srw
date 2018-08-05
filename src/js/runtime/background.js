import Sprite from '../base/sprite'

let {getLen} = require('src/js/utils').default
// const BG_IMG_SRC   = 'images/bg.jpg'
const BG_WIDTH     = 512
const BG_HEIGHT    = 512

/**
 * 游戏背景类
 * 提供update和render函数
 */
export default class BackGround extends Sprite {
  constructor(ctx, bgInfo) {
    super(bgInfo.bgImgSrc, BG_WIDTH, BG_HEIGHT)

    this.mapWidth = bgInfo.mapWidth
    this.mapHeight = bgInfo.mapHeight
    // this.hasDraw = false

    this.render(ctx)
  }

  update() {
    
  }

  /**
   * 背景图重绘函数
   * 
   */
  render(ctx) {
    // if (this.hasDraw) return

    ctx.drawImage(
      this.img,
      0,
      0,
      this.width,
      this.height,
      0,
      0,
      getLen(this.mapWidth),
      getLen(this.mapHeight)
    )

    this.drawGrid(ctx)

    // this.hasDraw = true
  }
  /**
   * 绘制地图栅格
   */
  drawGrid(ctx) {
    ctx.beginPath()
    for (let i = 0; i <= this.mapWidth; i++) {
      ctx.moveTo(getLen(i), 0)
      ctx.lineTo(getLen(i), getLen(this.mapHeight))
    }
    for (let i = 0; i <= this.mapHeight; i++) {
      ctx.moveTo(0, getLen(i))
      ctx.lineTo(getLen(this.mapWidth), getLen(i))
    }
    ctx.stroke()
    ctx.closePath()
  }
}
