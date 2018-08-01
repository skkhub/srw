import DataBus from '../databus'
import DialogMapMenu from '../dialog/dialogMapMenu'

let databus = new DataBus()

let {GRID_LENGTH, SCREEN_WIDTH, SCREEN_HEIGHT, getLen} = require('src/js/utils').default

let instance

/**
 * 定义状态枚举常量
 * 根据状态切换触摸事件
 */
const STATUS = {
  GAME_ENTRANCE: 101,
  GAME_OVER: 102,
  MAP_MAIN: 201,
  MAP_MENU: 202,  // 打开robot菜单
  MAP_MOVE: 203,
  MAP_ATTACK: 204,
  MAP_SYSTEM: 205,  // 打开系统菜单
  BATTLE_ENTRANCE: 301,
  BATTLE_MAIN: 302
}

let _status = STATUS.MAP_MAIN
/**
 * 统一的触摸事件管理，用于在不同状态下绑定不同的触屏事件
 */
export default class Event {
  constructor(canvas, ctx, mapWidth, mapHeight) {
    if ( instance )
      return instance

    instance = this

    this.canvas = canvas
    this.ctx = ctx
    this.mapWidth = getLen(mapWidth)
    this.mapHeight = getLen(mapHeight)
    // 记录手指点击屏幕时的坐标
    this.x = 0
    this.y = 0
    // 记录pointer所在的地图坐标
    this.posX = 0
    this.posY = 0
    // 记录视口的偏移
    this.translateX = 0
    this.translateY = 0

    this.dialogMapMenu = new DialogMapMenu(this)

    Object.defineProperty(this, 'status', {
      get() {
        return _status
      },
      set(val) {
        if (val > 200 && val < 300) {
          this.initViewportEvent()
          console.log('status改变：', val)
        } else {
          console.log('status改变：', val)
          this.removeViewportEvent()
        }
        _status = val
      }
    })

    this.initMainEvent()
  }
  
  initMainEvent() {
    // 初始化触摸管理器的状态
    this.status = STATUS.MAP_MAIN
    // 记录单次触摸指令是否有效
    this.valid = true
    // 手指点击的网格坐标
    this.posX = 0
    this.posY = 0

    this.canvas.addEventListener('touchstart', this.touchstartHandler.bind(this))
    this.canvas.addEventListener('touchmove', this.touchmoveHandler.bind(this))
    this.canvas.addEventListener('touchend', this.touchendHandler.bind(this))
  }

  initViewportEvent() {
    this.viewportBeginX = 0
    this.viewportBeginY = 0
    this.viewportBeginTime = Date.now()
    
    if (!this._isBindViewportEvent) {
      // 绑定作用域
      this.viewportTouchstartHandler = this.viewportTouchstartHandler.bind(this)
      this.viewportTouchmoveHandler = this.viewportTouchmoveHandler.bind(this)
      this.viewportTouchendHandler = this.viewportTouchendHandler.bind(this)
      this._isBindViewportEvent = true
    }

    this.canvas.addEventListener('touchstart', this.viewportTouchstartHandler)
    this.canvas.addEventListener('touchmove', this.viewportTouchmoveHandler)
    this.canvas.addEventListener('touchend', this.viewportTouchendHandler)
  }

  removeViewportEvent() {
    this.canvas.removeEventListener('touchstart', this.viewportTouchstartHandler)
    this.canvas.removeEventListener('touchmove', this.viewportTouchmoveHandler)
    this.canvas.removeEventListener('touchend', this.viewportTouchendHandler)
  }

  touchstartHandler(e) {
    e.preventDefault()

    this.valid = true
  }

  touchmoveHandler(e) {
    e.preventDefault()
    // 一旦移动，取消当次指令
    this.valid = false
  }

  touchendHandler(e) {
    e.preventDefault()
    if (!this.valid)
      return
    this.savePosition(e)
    switch(this.status) {
      case STATUS.GAME_ENTRANCE: console.log('GAME_ENTRANCE')
        break
      case STATUS.GAME_OVER: console.log('GAME_OVER')
        break
      case STATUS.MAP_MAIN: this.mapMainHandler()
        break
      case STATUS.MAP_MENU: this.mapMenuHandler()
        break
    }
  }

  savePosition(e) {
    let clientX = e.changedTouches[0].clientX
    let clientY = e.changedTouches[0].clientY
    this.x = clientX
    this.y = clientY
  }

  mapMainHandler() {
    this.posX = ((this.x - this.translateX) / GRID_LENGTH) | 0
    this.posY = ((this.y - this.translateY) / GRID_LENGTH) | 0
    console.log(this.posX, this.posY)
    let player = databus.players.concat(databus.enemys)
      .find(robot => (robot.posX == this.posX) && (robot.posY == this.posY))

    if (player) {
      this.dialogMapMenu.setRobot(player)
      this.dialogMapMenu.visible = true
      this.status = STATUS.MAP_MENU
    } else {
      this.dialogMapMenu.visible = false
      this.status = STATUS.MAP_MAIN
    }
  }

  mapMenuHandler() {
    if (this.y < SCREEN_HEIGHT - this.dialogMapMenu.dialogHeight) {
      this.mapMainHandler()
    } else {
      console.log('mapMenu')
      this.dialogMapMenu.handleDirectives(this.x, this.y)
    }
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
    if (this.status == STATUS.MAP_MENU && currentY > SCREEN_HEIGHT - this.dialogMapMenu.dialogHeight) {
      return
    }
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
  
  drawToCanvas() {
    this.renderPointer()

    this.dialogMapMenu.drawToCanvas(this.ctx)

  }
  renderPointer() {
    let ctx = this.ctx
    ctx.save()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 4
    ctx.beginPath()
    let x = getLen(this.posX)
    let y = getLen(this.posY)
    let len = GRID_LENGTH * 0.2 | 0
    ctx.moveTo(x, y + len)
    ctx.lineTo(x, y)
    ctx.lineTo(x + len, y)
    ctx.moveTo(x + GRID_LENGTH - len, y)
    ctx.lineTo(x + GRID_LENGTH, y)
    ctx.lineTo(x + GRID_LENGTH, y + len)
    ctx.moveTo(x + GRID_LENGTH, y + GRID_LENGTH - len)
    ctx.lineTo(x + GRID_LENGTH, y + GRID_LENGTH)
    ctx.lineTo(x + GRID_LENGTH - len, y + GRID_LENGTH)
    ctx.moveTo(x + len, y + GRID_LENGTH)
    ctx.lineTo(x, y + GRID_LENGTH)
    ctx.lineTo(x, y + GRID_LENGTH - len)
    ctx.moveTo(x, y - len)
    ctx.closePath()
    ctx.stroke()
    ctx.restore()
  }
}


