const Robot = module.exports = class {

  constructor (world, x, z) {
    this.world = world
    world.addRobot(this)
    this.x = x || 0
    this.z = z || 0
    this.stepHeight = 1
    this.direction = Robot.SOUTH
  }

  step (steps) {
    const max = typeof steps === 'number'  && steps >= 0 ? steps : 1
    let i
    for (i = 0; i < max; i += 1) {
      const tile = this.getTileBeforePosition()
      if (!tile) {
        throw new Error('Cannot step outside of world.')
      } else if (tile.hasBarrier) {
        throw new Error('Cannot step onto barrier.')
      } else if (Math.abs(tile.blocks - this.getTileAtPosition().blocks) > this.stepHeight) {
        throw new Error('Cannot jump so high or deep.')
      } else {
        this.x = tile.x
        this.z = tile.z
      }
    }
  }

  getPosition () {
    return {
      x: this.x,
      z: this.z
    }
  }

  getTileAtPosition () {
    return this.world.getTileAt(this.x, this.z)
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

  getTileBeforePosition () {
    const position = this.getPositionBefore()
    return this.world.getTileAt(position.x, position.z)
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

  removeMark () {
    const position = this.getPosition()
    this.world.getTileAt(position.x, position.z).hasMark = false
  }

  setBarrier () {
    const position = this.getPositionBefore()
    const tile = this.world.getTileAt(position.x, position.z)
    if (!tile) {
      throw new Error('Cannot set a barrier outside of world.')
    }
    if (tile.hasMark || tile.blocks > 0) {
      throw new Error('Cannot set a barrier on a non-empty tile.')
    }
    tile.hasBarrier = true
  }

  removeBarrier () {
    const position = this.getPositionBefore()
    const tile = this.world.getTileAt(position.x, position.z)
    if (!tile) {
      throw new Error('Cannot remove a barrier outside of world.')
    }
    tile.hasBarrier = false
  }

}

Robot.NORTH = Symbol('North')
Robot.EAST = Symbol('East')
Robot.SOUTH = Symbol('South')
Robot.WEST = Symbol('West')
