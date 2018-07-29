
let {SCREEN_WIDTH, SCREEN_HEIGHT, getLen} = require('src/js/utils').default

let instance

/**
 * 统一的视口管理器，用于响应手指拖动视口
 */
export default class Viewport {
  constructor(canvas, ctx, mapWidth, mapHeight) {
    if ( instance )
      return instance

    instance = this
    
    this.mapWidth = getLen(mapWidth)
    this.mapHeight = getLen(mapHeight)
    this.ctx = ctx

    this.viewportBeginX = 0
    this.viewportBeginY = 0
    this.viewportBeginTime = Date.now()
    // 记录视口的偏移
    this.translateX = 0
    this.translateY = 0

    canvas.addEventListener('touchstart', this.viewportTouchstartHandler.bind(this))
    canvas.addEventListener('touchmove', this.viewportTouchmoveHandler.bind(this))
    canvas.addEventListener('touchend', this.viewportTouchendHandler.bind(this))
  }

  viewportTouchstartHandler(e) {
    e.preventDefault()

    this.viewportBeginX = e.touches[0].clientX
    this.viewportBeginY = e.touches[0].clientY

    this.viewportBeginTime = Date.now()
  }

  viewportTouchmoveHandler(e) {
    e.preventDefault()

    let currentX = e.changedTouches[0].clientX
    let currentY = e.changedTouches[0].clientY
    let currentTime = Date.now()

    let kx = (currentX - this.viewportBeginX) / (currentTime - this.viewportBeginTime) * 20
    let ky = (currentY - this.viewportBeginY) / (currentTime - this.viewportBeginTime) * 20

    this.translateX += kx
    this.translateY += ky

    if ( this.translateX <= SCREEN_WIDTH - this.mapWidth
      || this.translateX >= 0 ) {

      this.translateX -= kx
      kx = 0
    }
    if ( this.translateY <= SCREEN_HEIGHT - this.mapHeight
          || this.translateY >= 0) {
      this.translateY -= ky

      ky = 0
    }

    this.ctx.translate(kx, ky)
    this.viewportBeginX = currentX
    this.viewportBeginY = currentY
    this.viewportBeginTime = currentTime
  }

  viewportTouchendHandler(e) {
    e.preventDefault()
  }

  clearRect() {
    this.ctx.clearRect(-this.translateX, -this.translateY, SCREEN_WIDTH, SCREEN_HEIGHT)
  }
}
