let instance

/**
 * 定义状态枚举常量
 * 根据状态切换触摸事件
 */
const STATUS = {
  GAME_ENTRANCE: 101,
  GAME_OVER: 102,
  MAP_MAIN: 201,
  MAP_MENU: 202,
  MAP_MOVE: 203,
  MAP_ATTACK: 204,
  BATTLE_ENTRANCE: 301,
  BATTLE_MAIN: 302
}

/**
 * 统一的触摸事件管理，用于在不同状态下绑定不同的触屏事件
 */
export default class Event {
  constructor() {
    if ( instance )
      return instance

    instance = this

    // 初始化触摸管理器的状态
    this.status = STATUS.MAP_MAIN
    // 记录单次触摸指令是否有效
    this.valid = true
    // 手指点击的网格坐标
    this.x = 0
    this.y = 0

    canvas.addEventListener('touchstart', this.touchstartHandler.bind(this))
    canvas.addEventListener('touchmove', this.touchmoveHandler.bind(this))
    canvas.addEventListener('touchend', this.touchendHandler.bind(this))
  }

  touchstartHandler(e) {
    e.preventDefault()

    this.valid = true
  }

  touchmoveHandler(e) {
    e.preventDefault()
    // 一旦移动，取消当次指令
    // this.valid = false
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
    }
  }

  savePosition(e) {
    let clientX = e.changedTouches[0].clientX
    let clientY = e.changedTouches[0].clientY

    this.x = (clientX / GRID_LENGTH) | 0
    this.y = (clientY / GRID_LENGTH) | 0
  }

  mapMainHandler() {
    console.log(this.x, this.y)
  }

}
