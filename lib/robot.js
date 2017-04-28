const Error = require('./error.js')

const Robot = module.exports = class {

  constructor (world, x, y) {
    this.world = world
    world.addRobot(this)
    this.x = x || 0
    this.z = y || 0
    this.direction = Robot.SOUTH
  }

  step (steps) {
    const max = typeof steps === 'number'  && steps >= 0 ? steps : 1
    let i
    for (i = 0; i < max; i += 1) {
      const position = this.getPositionBefore()
      if (this.world.isOutOfBounds(position.x, position.z)) {
        throw new Error('Cannot step outside of world.')
      } else {
        this.x = position.x
        this.z = position.z
      }
    }
  }

  getPosition () {
    return {
      x: this.x,
      z: this.z
    }
  }

  getPositionBefore () {
    if (this.direction === Robot.NORTH) {
      return {
        x: this.x,
        z: this.z - 1
      }
    } else if (this.direction === Robot.EAST) {
      return {
        x: this.x + 1,
        z: this.z
      }
    } else if (this.direction === Robot.SOUTH) {
      return {
        x: this.x,
        z: this.z + 1
      }
    } else if (this.direction === Robot.WEST) {
      return {
        x: this.x - 1,
        z: this.z
      }
    }
  }

  turnLeft () {
    if (this.direction === Robot.NORTH) {
      this.direction = Robot.WEST
    } else if (this.direction === Robot.EAST) {
      this.direction = Robot.NORTH
    } else if (this.direction === Robot.SOUTH) {
      this.direction = Robot.EAST
    } else if (this.direction === Robot.WEST) {
      this.direction = Robot.SOUTH
    }
  }

  turnRight () {
    if (this.direction === Robot.NORTH) {
      this.direction = Robot.EAST
    } else if (this.direction === Robot.EAST) {
      this.direction = Robot.SOUTH
    } else if (this.direction === Robot.SOUTH) {
      this.direction = Robot.WEST
    } else if (this.direction === Robot.WEST) {
      this.direction = Robot.NORTH
    }
  }

  layDown (amount) {
    const position = this.getPositionBefore()
    const tile = this.world.getTileAt(position.x, position.z)
    if (!tile) {
      throw new Error('Cannot lay down a block outside of world.')
    }
    tile.blocks += typeof amount === 'number' && amount > 0 ? amount : 1
    if (tile.blocks > this.world.height) {
      throw new Error('Reached maximum height of world.')
      tile.blocks = this.world.height
    }
  }

  pickUp (amount) {
    const position = this.getPositionBefore()
    const tile = this.world.getTileAt(position.x, position.z)
    if (!tile) {
      throw new Error('Cannot pick up a block outside of world.')
    }
    tile.blocks -= typeof amount === 'number' && amount > 0 ? amount : 1
    if (tile.blocks < 0) {
      throw new Error('No more blocks to pick up.')
      tile.blocks = 0
    }
  }

  setMark () {
    const position = this.getPosition()
    this.world.getTileAt(position.x, position.z).hasMark = true
  }

  deleteMark () {
    const position = this.getPosition()
    this.world.getTileAt(position.x, position.z).hasMark = false
  }

}

Robot.NORTH = Symbol('North')
Robot.EAST = Symbol('East')
Robot.SOUTH = Symbol('South')
Robot.WEST = Symbol('West')
