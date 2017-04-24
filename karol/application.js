Karol.Application = class {

  constructor (interpreter, canvas, karolConsole) {
    this.interpreter = interpreter
    this.ctx = canvas.getContext('2d')
    this.karolConsole = karolConsole
    this.world = new Karol.World()
    this.robot = new Karol.Robot(this.world)
    this.robot.x = 4
    this.robot.z = 3
    this.addStandardLibrary()

    this.interpreter.on('statement', this.render.bind(this))
    this.interpreter.on('error', this.printError.bind(this))
  }

  addStandardLibrary () {
    const {interpreter} = this

    interpreter.addProcedure(new Karol.Procedure({
      name: 'step',
      cb: (args) => this.robot.step(args[0] ? args[0].value : 1),
      expectedArguments: [{
        type: Karol.Value.NUMBER,
        optional: true
      }]
    }))

    interpreter.addProcedure(new Karol.Procedure({
      name: 'turnleft',
      cb: this.robot.turnLeft.bind(this.robot, undefined)
    }))

    interpreter.addProcedure(new Karol.Procedure({
      name: 'turnright',
      cb: this.robot.turnRight.bind(this.robot, undefined)
    }))

    interpreter.addProcedure(new Karol.Procedure({
      name: 'laydown',
      cb: this.robot.layDown.bind(this.robot, undefined)
    }))

    interpreter.addProcedure(new Karol.Procedure({
      name: 'pickup',
      cb: this.robot.pickUp.bind(this.robot, undefined)
    }))

    interpreter.addProcedure(new Karol.Procedure({
      name: 'setmark',
      cb: this.robot.setMark.bind(this.robot)
    }))

    interpreter.addProcedure(new Karol.Procedure({
      name: 'deletemark',
      cb: this.robot.deleteMark.bind(this.robot)
    }))

    interpreter.addProcedure(new Karol.Procedure({
      name: 'wall',
      cb: () => {
        const position = this.robot.getPositionBefore()
        return Karol.Value.createBoolean(!this.world.getTileAt(position.x, position.z))
      }
    }))

    interpreter.addProcedure(new Karol.Procedure({
      name: 'not',
      cb: (args) => {
        return Karol.Value.createBoolean(!args[0].castToBoolean().value)
      },
      expectedArguments: [{
        type: Karol.Value.ANY
      }]
    }))

    interpreter.addProcedure(new Karol.Procedure({
      name: 'fast',
      cb: () => {
        interpreter.speed = 200
      }
    }))

    interpreter.addProcedure(new Karol.Procedure({
      name: 'slow',
      cb: () => {
        interpreter.speed = 600
      }
    }))

    interpreter.addProcedure(new Karol.Procedure({
      name: 'print',
      cb: (args) => {
        this.karolConsole.log(...args)
      }
    }))
  }

  render () {
    const {ctx, world, robot} = this
    const {width, height} = ctx.canvas

    // clear the canvas from the previous image
    ctx.clearRect(0, 0, width, height)

    // render the world
    const tileWidth = width / world.width
    const tileHeight = height / world.depth
    let x, z
    for (x = 0; x < world.width; x += 1) {
      for (z = 0; z < world.depth; z += 1) {
        const tile = world.getTileAt(x, z)
        ctx.fillStyle = tile.hasMark ? 'yellow' : 'red'
        ctx.fillRect(x * tileWidth, z * tileHeight, tileWidth - 2, tileHeight - 2)
        ctx.fillStyle = 'white'
        ctx.fillText(tile.blocks.toString(), x * tileWidth + 10, z * tileHeight + 25)
      }
    }

    // render the robot
    ctx.fillStyle = 'blue'
    let tipX, tipY, base1X, base1Y, base2X, base2Y
    if (robot.direction === Karol.Robot.NORTH) {
      tipX = robot.x * tileWidth + tileWidth / 2
      tipY = robot.z * tileHeight + 4
      base1X = robot.x * tileWidth + 4
      base1Y = (robot.z + 1) * tileHeight - 4
      base2X = (robot.x + 1) * tileWidth - 4
      base2Y = base1Y
    } else if (robot.direction === Karol.Robot.EAST) {
      tipX = (robot.x + 1) * tileWidth - 4
      tipY = robot.z * tileHeight + tileHeight / 2
      base1X = robot.x * tileWidth + 4
      base1Y = robot.z * tileHeight + 4
      base2X = base1X
      base2Y = (robot.z + 1) * tileHeight - 4
    } else if (robot.direction === Karol.Robot.SOUTH) {
      tipX = robot.x * tileWidth + tileWidth / 2
      tipY = (robot.z + 1) * tileHeight - 4
      base1X = robot.x * tileWidth + 4
      base1Y = robot.z * tileHeight + 4
      base2X = (robot.x + 1) * tileWidth - 4
      base2Y = base1Y
    } else if (robot.direction === Karol.Robot.WEST) {
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

  createImage (openDialog, imageType) {
    const dataURL = this.ctx.canvas.toDataURL(imageType || 'image/png')
    return dataURL
  }

  printError (error) {
    if (error instanceof window.Error) {
      this.karolConsole.error(new Karol.Error(`Interpreter error in file ${error.fileName}: ` + error.message, {
        line: error.lineNumber,
        column: error.columnNumber
      }))
    } else {
      this.karolConsole.error(error)
    }
  }

}
