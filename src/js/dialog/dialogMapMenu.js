let {SCREEN_WIDTH, SCREEN_HEIGHT, DIALOG_SRC, BASE_FONT_SIZE} = require('../utils').default

let dialogImg = new Image()
dialogImg.src = require('src/' + DIALOG_SRC)
let instance
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

    this.visible = true
  }

  setRobot(robot) {
    this.robot = robot
  }
  /**
   * 将精灵图绘制在canvas上
   */
  drawToCanvas(ctx) {
    if ( !this.visible || !this.robot) {
      return
    }
    const dialogHeight = 200
    const dialogOriginX = -this.evt.translateX
    const dialogOriginY = -this.evt.translateY + SCREEN_HEIGHT - dialogHeight
    const itemWidth = SCREEN_WIDTH / 7 | 0
    const itemSpace = SCREEN_WIDTH / 12 | 0
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
    ctx.fillStyle = '#fff'
    ctx.fillRect(dialogOriginX + SCREEN_WIDTH * 0.04, dialogOriginY + 18, SCREEN_WIDTH * 0.46, dialogHeight * 0.84)

    ctx.fillStyle = '#003E55'
    ctx.font    = `${BASE_FONT_SIZE * 2}px Arial`
    const itemX1 = dialogOriginX + SCREEN_WIDTH * 0.087
    const itemX2 = dialogOriginX + SCREEN_WIDTH * 0.087 + itemWidth + itemSpace
    const itemY1 = dialogOriginY + 60
    const itemY2 = dialogOriginY + 110
    const itemY3 = dialogOriginY + 160
    let arr = ['移动', '变形', '攻击', '精神', '能力']
    let pos = [[itemX1, itemY1], [itemX2, itemY1], [itemX1, itemY2], [itemX2, itemY2], [itemX1, itemY3], [itemX2, itemY3]]
    arr.forEach((item, index) => {
      ctx.fillText(
        item,
        pos[index][0],
        pos[index][1]
      )
    })
    ctx.textAlign = 'end'
    ctx.fillText(
      this.robot.name,
      dialogOriginX + SCREEN_WIDTH * 0.9,
      itemY1
    )
    ctx.textAlign = 'start'
    ctx.font = `${BASE_FONT_SIZE * 1.6}px Arial`
    ctx.fillText(
      `HP:${this.robot.currentHP}/${this.robot.HP}`,
      dialogOriginX + SCREEN_WIDTH * 0.52,
      itemY2
    )
    ctx.fillText(
      `EN:${this.robot.currentEN}/${this.robot.EN}`,
      dialogOriginX + SCREEN_WIDTH * 0.52,
      itemY3
    )
    ctx.restore()
  }
}
