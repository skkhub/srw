let {SCREEN_WIDTH, SCREEN_HEIGHT, GRID_LENGTH, getLen} = require('src/js/utils').default

const canvas = document.getElementById('canvas')
canvas.width = SCREEN_WIDTH
canvas.height = SCREEN_HEIGHT

const ctx = canvas.getContext('2d')
ctx.textBaseline = 'middle'

let mapWidth = 16
let mapHeight = 30

let counter = 0
drawGrid(ctx)
drawToCanvas(ctx)
ctx.fillStyle = 'black'
ctx.fillRect(getLen(6), getLen(5), GRID_LENGTH, GRID_LENGTH)

tryImageData()

function drawToCanvas(ctx) {
    ctx.fillStyle = 'rgba(0, 127, 255, 0.5)'
    ctx.beginPath()
    drawMoveRange2(ctx, 4, getLen(6), getLen(5), 3, 5)
    let x = getLen(4)
    let y = getLen(5)
    let x2 = getLen(4)
    let y2 = getLen(16)
    let flag = ctx.isPointInPath(x, y)
    console.log(flag)
    ctx.rect(x, y, GRID_LENGTH, GRID_LENGTH)
    ctx.closePath()
    ctx.fill('evenodd')
    let flag3 = ctx.isPointInPath(x, y)
    console.log('flag3: ', flag3)

    
    ctx.beginPath()
    drawMoveRange2(ctx, 5, getLen(6), getLen(16))
    let flag2 = ctx.isPointInPath(String(x2), String(y2))
    console.log(flag2)
    ctx.rect(x2, y2, GRID_LENGTH, GRID_LENGTH)
    ctx.fill()
}

function drawMoveRange2(ctx, num, x, y) {
  ctx.moveTo(x, y - num * GRID_LENGTH)
  for(let i = 0; i <= num; i++) {
    ctx.lineTo(x + GRID_LENGTH * (i + 1), y - num * GRID_LENGTH + GRID_LENGTH * i)
    ctx.lineTo(x + GRID_LENGTH * (i + 1), y - num * GRID_LENGTH + GRID_LENGTH * (i + 1))
  }
  for(let i = 0; i < num; i++) {
    ctx.lineTo(x + GRID_LENGTH * (num - i), y + (i + 1) * GRID_LENGTH)
    ctx.lineTo(x + GRID_LENGTH * (num - i), y + (i + 2) * GRID_LENGTH)
  }
  for(let i = 0; i <= num; i++) {
    ctx.lineTo(x - GRID_LENGTH * i, y + (num + 1) * GRID_LENGTH - GRID_LENGTH * i)
    ctx.lineTo(x - GRID_LENGTH * i, y + (num + 1) * GRID_LENGTH - GRID_LENGTH * (i + 1))
  }
  for(let i = 0; i < num; i++) {
    ctx.lineTo(x - GRID_LENGTH * (num - i - 1), y - i * GRID_LENGTH)
    ctx.lineTo(x - GRID_LENGTH * (num - i - 1), y - (i + 1) * GRID_LENGTH)
  }
}

function drawMoveRange(ctx, num, x, y, posX, posY, key) {
  if (num < 1) {
    console.log(counter)
    return
  }
  counter++
  let flags = {
    top: true,
    left: true,
    right: true,
    bottom: true,
  }
  if (key) {
    flags[key] = false
  }
  /*
  let keyTop = `${posX}_${posY - 1}`
  let keyLeft = `${posX - 1}_${posY}`
  let keyRight = `${posX + 1}_${posY}`
  let keyBottom = `${posX}_${posY + 1}`
  flags.top = !Boolean(databus.players[keyTop] || databus.enemys[keyTop])
  flags.left = !Boolean(databus.players[keyLeft] || databus.enemys[keyLeft])
  flags.right = !Boolean(databus.players[keyRight] || databus.enemys[keyRight])
  flags.bottom = !Boolean(databus.players[keyBottom] || databus.enemys[keyBottom])
  */
  // databus.mapInfo[keyTop] && (flags.top = databus.mapInfo[keyTop]['move'])
  if (flags.top) {
    ctx.rect(x, y - GRID_LENGTH, GRID_LENGTH, GRID_LENGTH)
    drawMoveRange(ctx, num-1, x, y - GRID_LENGTH, posX, posY - 1, 'bottom')
  }
  
  if (flags.right) {
    ctx.rect(x + GRID_LENGTH, y, GRID_LENGTH, GRID_LENGTH)
    drawMoveRange(ctx, num-1, x + GRID_LENGTH, y, posX + 1, posY, 'left')
  }
  if (flags.bottom) {
    ctx.rect(x, y + GRID_LENGTH, GRID_LENGTH, GRID_LENGTH)
    drawMoveRange(ctx, num-1, x, y + GRID_LENGTH, posX, posY + 1, 'top')
  }
  if (flags.left) {
    ctx.rect(x - GRID_LENGTH, y, GRID_LENGTH, GRID_LENGTH)
    drawMoveRange(ctx, num-1, x - GRID_LENGTH, y, posX - 1, posY, 'right')
  }
  
}
// function drawRectPath()
function drawGrid(ctx) {
  ctx.strokeStyle = '#000'
  ctx.beginPath()
  for (let i = 0; i <= mapWidth; i++) {
    ctx.moveTo(getLen(i), 0)
    ctx.lineTo(getLen(i), getLen(mapHeight))
  }
  for (let i = 0; i <= mapHeight; i++) {
    ctx.moveTo(0, getLen(i))
    ctx.lineTo(getLen(mapWidth), getLen(i))
  }
  ctx.stroke()
  ctx.closePath()
}

function tryImageData() {
  var myImageData = ctx.getImageData(getLen(4), getLen(5), GRID_LENGTH, GRID_LENGTH);
  console.log(myImageData)
  ctx.putImageData(myImageData, 0, 0)
}