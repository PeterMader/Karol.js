const Robot = require('./robot.js')
const WorldTile = require('./world-tile.js')

const World = module.exports = class {

  constructor (canvas, width, depth, height) {
    this.ctx = canvas.getContext('2d')
    this.width = typeof width === 'number' && width > 0 ? width : 10
    this.depth = typeof depth === 'number' && depth > 0 ? depth : 10
    this.height = typeof height === 'number' && height > 0 ? height : 10
    this.data = []
    this.robots = []
    this.reset()
  }

  addRobot (robot) {
    this.robots.push(robot)
  }

  isOutOfBounds (x, z) {
    return x < 0 || z < 0 || x >= this.width || z >= this.depth
  }

  getTileAt (x, z) {
    return this.data[x][z] || null
  }

  reset () {
    this.data = []
    let x, z
    for (x = 0; x < this.width; x += 1) {
      this.data[x] = []
      for (z = 0; z < this.depth; z += 1) {
        this.data[x][z] = new WorldTile()
      }
    }
  }

  render () {
    const {ctx, robots} = this
    const {width, height} = ctx.canvas

    // clear the canvas from the previous image
    ctx.clearRect(0, 0, width, height)

    // render the world
    const tileWidth = width / this.width
    const tileHeight = height / this.depth
    let x, z
    for (x = 0; x < this.width; x += 1) {
      for (z = 0; z < this.depth; z += 1) {
        const tile = this.getTileAt(x, z)
        ctx.fillStyle = tile.hasMark ? 'yellow' : 'red'
        ctx.fillRect(x * tileWidth, z * tileHeight, tileWidth - 2, tileHeight - 2)
        ctx.fillStyle = 'white'
        ctx.fillText(tile.blocks.toString(), x * tileWidth + 10, z * tileHeight + 25)
      }
    }

    // render the robots
    let index
    for (index in robots) {
      const robot = robots[index]
      ctx.fillStyle = 'blue'
      let tipX, tipY, base1X, base1Y, base2X, base2Y
      if (robot.direction === Robot.NORTH) {
        tipX = robot.x * tileWidth + tileWidth / 2
        tipY = robot.z * tileHeight + 4
        base1X = robot.x * tileWidth + 4
        base1Y = (robot.z + 1) * tileHeight - 4
        base2X = (robot.x + 1) * tileWidth - 4
        base2Y = base1Y
      } else if (robot.direction === Robot.EAST) {
        tipX = (robot.x + 1) * tileWidth - 4
        tipY = robot.z * tileHeight + tileHeight / 2
        base1X = robot.x * tileWidth + 4
        base1Y = robot.z * tileHeight + 4
        base2X = base1X
        base2Y = (robot.z + 1) * tileHeight - 4
      } else if (robot.direction === Robot.SOUTH) {
        tipX = robot.x * tileWidth + tileWidth / 2
        tipY = (robot.z + 1) * tileHeight - 4
        base1X = robot.x * tileWidth + 4
        base1Y = robot.z * tileHeight + 4
        base2X = (robot.x + 1) * tileWidth - 4
        base2Y = base1Y
      } else if (robot.direction === Robot.WEST) {
        tipX = robot.x * tileWidth + 4
        tipY = robot.z * tileHeight + tileHeight / 2
        base1X = (robot.x + 1) * tileWidth - 4
        base1Y = robot.z * tileHeight + 4
        base2X = base1X
        base2Y = (robot.z + 1) * tileHeight - 4
      }
      ctx.beginPath()
      ctx.moveTo(tipX, tipY)
      ctx.lineTo(base1X, base1Y)
      ctx.lineTo(base2X, base2Y)
      ctx.closePath()
      ctx.fill()
    }
  }

  createImage (openDialog, imageType) {
    const dataURL = this.ctx.canvas.toDataURL(imageType || 'image/png')
    return dataURL
  }

}
