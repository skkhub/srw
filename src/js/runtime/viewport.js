import DataBus  from '../databus'

let databus = new DataBus()
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

    this.beginX = 0
    this.beginY = 0
    this.beginTime = Date.now()

    databus.viewportTranslateX = 0
    databus.viewportTranslateY = 0

    canvas.addEventListener('touchstart', this.touchstartEventHandler.bind(this))
    canvas.addEventListener('touchmove', this.touchmoveEventHandler.bind(this))
    canvas.addEventListener('touchend', this.touchendEventHandler.bind(this))
  }

  touchstartEventHandler(e) {
    e.preventDefault()

    databus.viewportTouched = true

    this.beginX = e.touches[0].clientX
    this.beginY = e.touches[0].clientY

    this.beginTime = Date.now()
  }

  touchmoveEventHandler(e) {
    e.preventDefault()

    let currentX = e.changedTouches[0].clientX
    let currentY = e.changedTouches[0].clientY
    let currentTime = Date.now()
    let dTime = currentTime - this.beginTime
    // console.log(dTime)
    let kx = (currentX - this.beginX) / (currentTime - this.beginTime) * 20
    let ky = (currentY - this.beginY) / (currentTime - this.beginTime) * 20

    console.log(kx, ky)
    // let translateX = (currentX - this.beginX) / 10
    // let translateY = (currentY - this.beginY) / 10

    databus.viewportTranslateX += kx
    databus.viewportTranslateY += ky

    this.ctx.translate(kx, ky)
    this.beginX = currentX
    this.beginY = currentY
    this.beginTime = currentTime
  }

  touchmoveEventHandlerOld(e) {
    e.preventDefault()

    let currentX = e.changedTouches[0].clientX
    let currentY = e.changedTouches[0].clientY
    let currentTime = Date.now()
    let dTime = currentTime - this.beginTime
    // console.log(dTime)
    let kx = (currentX - this.beginX) / (currentTime - this.beginTime) * 24
    let ky = (currentY - this.beginY) / (currentTime - this.beginTime) * 24

    console.log(kx, ky)
    // let translateX = (currentX - this.beginX) / 10
    // let translateY = (currentY - this.beginY) / 10

    databus.viewportTranslateX += kx
    databus.viewportTranslateY += ky
/*
    if ( databus.viewportTranslateX <= SCREEN_WIDTH - this.mapWidth
         || databus.viewportTranslateX >= 0 ) {

      databus.viewportTranslateX -= translateX
      translateX = 0
    }
    if ( databus.viewportTranslateY <= SCREEN_HEIGHT - this.mapHeight
         || databus.viewportTranslateY >= 0) {
      databus.viewportTranslateY -= translateY

      translateY = 0
    }
    */
    this.ctx.translate(kx, ky)
  }

  touchendEventHandler(e) {
    e.preventDefault()

    databus.viewportTouched = false
  }

  clearRect() {
    this.ctx.clearRect(-databus.viewportTranslateX, -databus.viewportTranslateY, SCREEN_WIDTH, SCREEN_HEIGHT)
  }
}
