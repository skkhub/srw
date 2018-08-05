import Pool from './base/pool'

let instance

/**
 * 全局状态管理器
 */
export default class DataBus {
  constructor() {
    if ( instance )
      return instance

    instance = this

    this.pool = new Pool()

    this.reset()
  }

  reset() {
    this.frame      = 0
    this.score      = 0
    this.bullets    = []
    this.enemys     = {}
    this.players    = {}
    this.animations = []
    this.gameOver   = false
    this.mapInfo    = {}
  }

  /**
   * 监听对象属性值变化，并响应到自身属性里
   * uncomplate
   */
  watch(obj, keyArr, targetKeyArr) {
    let that = this

    let keys = Array.isArray(keyArr) ? keyArr
               : typeof keyArr === 'string' ? [keyArr]
               : new Error('watch函数的第二个参数应为string或包含string的数组')
    let targetKeys = Array.isArray(targetKeyArr) ? targetKeyArr
               : typeof targetKeyArr === 'string' ? [targetKeyArr] 
               : new Error('watch函数的第三个参数应为string或包含string的数组')

    for (let i = 0, len = keys.length; i < len; i++) {
      let key = keyArr[i]
      let tKey = targetKeys[i] ? targetKeys[i] : key
      console.log(obj)
      Object.defineProperty(obj, key, {
        set(val) {
          that[tKey] = val
          console.log(obj,that)
          
          obj[key] = val
        }
      })
    }
  }

  initMapInfo(grid) {
    for (let k in grid) {
      this.mapInfo[k] = grid[k]
    }
  }

  // updateRobotMapInfo() {
  //   this.players.concat(this.enemys).forEach(robot => {
  //     let k = `${robot.posX}_${robot.posY}`
  //     this.mapInfo[k] = robot
  //   })
  // }
  /**
   * 回收敌人，进入对象池
   * 此后不进入帧循环
   */
  removeEnemey(enemy) {
    let temp = this.enemys.shift()

    temp.visible = false

    this.pool.recover('enemy', enemy)
  }

  /**
   * 回收子弹，进入对象池
   * 此后不进入帧循环
   */
  removeBullets(bullet) {
    let temp = this.bullets.shift()

    temp.visible = false

    this.pool.recover('bullet', bullet)
  }
}
