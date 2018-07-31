let {SCREEN_WIDTH, SCREEN_HEIGHT, DIALOG_SRC, BASE_FONT_SIZE} = require('../utils').default

const directiveMap = {
  canMove: '移动',
  canAttack: '攻击',
  canTransform: '变形',
  canSpirit: '精神'
}

let dialogImg = new Image()
dialogImg.src = require('src/' + DIALOG_SRC)

let dialogIcon = new Image()

let instance
// drawToCanvas函数用到的变量
const dialogHeight = 200

const itemWidth = SCREEN_WIDTH / 6 | 0
const itemHeight = 40
const itemSpace = SCREEN_WIDTH / 20 | 0
const paddingX = SCREEN_WIDTH * 0.08
const iconWidth = 70
const iconHeight = 70
let HPWidth = SCREEN_WIDTH * 0.48 - paddingX  // 血条宽度

/**
 * 游戏对话框类
 */
export default class DialogMapMenu {
  constructor(evt) {
    if ( instance )
      return instance

    instance = this
    // 保存下event对象实例
    this.evt = evt
    this.robot = null
    this.icon = ''
    this.visible = true
  }

  setRobot(robot) {
    this.robot = robot
    dialogIcon.src = require('src/images/' + robot.icon)
    this.directives = []
    for (let k in robot.wartime) {
      let directive = directiveMap[k]
      if (directiveMap[k] && robot.wartime[k]) {
        this.directives.push(directive)
      }
    }
    this.directives.push('能力')
  }
  /**
   * 将精灵图绘制在canvas上
   */
  drawToCanvas(ctx) {
    if ( !this.visible || !this.robot) {
      return
    }

    const dialogOriginX = -this.evt.translateX
    const dialogOriginY = -this.evt.translateY + SCREEN_HEIGHT - dialogHeight

    ctx.save()
    ctx.drawImage(
      dialogImg,
      // 4,
      // 106,
      // 60,
      // 56,
      18,
      29,
      84,
      64,
      dialogOriginX,
      dialogOriginY,
      SCREEN_WIDTH,
      200
    )
    // ctx.fillStyle = '#fff'
    // ctx.fillRect(dialogOriginX + SCREEN_WIDTH * 0.04, dialogOriginY + 18, SCREEN_WIDTH * 0.46, dialogHeight * 0.84)

    ctx.fillStyle = '#fff'
    ctx.font    = `${BASE_FONT_SIZE * 1.6}px Arial`
    const itemX1 = dialogOriginX + paddingX
    const itemX2 = dialogOriginX + paddingX + itemWidth + itemSpace
    const itemY1 = dialogOriginY + 32
    const itemY2 = dialogOriginY + 82
    const itemY3 = dialogOriginY + 132
    // 画指令菜单
    let pos = [[itemX1, itemY1], [itemX2, itemY1], [itemX1, itemY2], [itemX2, itemY2], [itemX1, itemY3], [itemX2, itemY3]]
    this.directives.forEach((item, index) => {
      ctx.drawImage(
        dialogImg,
        120, 7, 38, 22,
        pos[index][0], pos[index][1], itemWidth, itemHeight
      )
      ctx.fillText(
        item,
        pos[index][0] + 12,
        pos[index][1] + itemHeight / 2
      )
    })
    // 画状态栏
    ctx.fillStyle = '#003E55'

    ctx.font = `${BASE_FONT_SIZE}px Arial`
    ctx.fillText(
      this.robot.name,
      dialogOriginX + SCREEN_WIDTH * 0.52,
      dialogOriginY + dialogHeight / 8 + 20
    )
    ctx.fillText(
      `LV. ${this.robot.wartime.LV}`,
      dialogOriginX + SCREEN_WIDTH * 0.52,
      dialogOriginY + dialogHeight * 2 / 8 + 20
    )
    ctx.fillText(
      `气力 ${this.robot.wartime.anger}`,
      dialogOriginX + SCREEN_WIDTH * 0.52,
      dialogOriginY + dialogHeight * 3 / 8 + 20
    )
    ctx.fillText(
      `HP`,
      dialogOriginX + SCREEN_WIDTH * 0.52,
      dialogOriginY + dialogHeight * 4 / 8 + 20
    )
    ctx.fillText(
      `EN`,
      dialogOriginX + SCREEN_WIDTH * 0.52,
      dialogOriginY + dialogHeight * 6 / 8 + 4
    )
    ctx.textAlign = 'end'
    ctx.fillText(
      `${this.robot.wartime.HP}/${this.robot.HP}`,
      dialogOriginX + SCREEN_WIDTH - paddingX,
      dialogOriginY + dialogHeight * 4 / 8 + 20
    )
    ctx.fillText(
      `${this.robot.wartime.EN}/${this.robot.EN}`,
      dialogOriginX + SCREEN_WIDTH - paddingX,
      dialogOriginY + dialogHeight * 6 / 8 + 4
    )
    // 画血条跟EN条
    ctx.fillStyle = '#cc3300'
    ctx.fillRect(dialogOriginX + SCREEN_WIDTH * 0.52, dialogOriginY + dialogHeight * 4 / 8 + 28, HPWidth, dialogHeight / 20)
    ctx.fillRect(dialogOriginX + SCREEN_WIDTH * 0.52, dialogOriginY + dialogHeight * 6 / 8 + 12, HPWidth, dialogHeight / 20)
    ctx.fillStyle = '#00ff00'
    ctx.fillRect(dialogOriginX + SCREEN_WIDTH * 0.52, dialogOriginY + dialogHeight * 4 / 8 + 28, HPWidth * this.robot.wartime.HP / this.robot.HP, dialogHeight / 20)    
    ctx.fillRect(dialogOriginX + SCREEN_WIDTH * 0.52, dialogOriginY + dialogHeight * 6 / 8 + 12, HPWidth * this.robot.wartime.EN / this.robot.EN, dialogHeight / 20)
    // 画icon
    ctx.drawImage(
      dialogIcon,
      dialogOriginX + SCREEN_WIDTH - paddingX - iconWidth,
      itemY1,
      iconWidth,
      iconHeight
    )
    ctx.restore()
  }
}
