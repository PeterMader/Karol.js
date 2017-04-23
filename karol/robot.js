Karol.Robot = class {

  constructor (world) {
    this.world = world
    this.x = 0
    this.z = 0
    this.direction = Karol.Robot.SOUTH
  }

  step (steps) {
    const max = typeof steps === 'number'  && steps >= 0 ? steps : 1
    let i
    for (i = 0; i < max; i += 1) {
      const position = this.getPositionBefore()
      if (this.world.isOutOfBounds(position.x, position.z)) {
        throw new Karol.Error('Cannot step outside of world.')
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
    if (this.direction === Karol.Robot.NORTH) {
      return {
        x: this.x,
        z: this.z - 1
      }
    } else if (this.direction === Karol.Robot.EAST) {
      return {
        x: this.x + 1,
        z: this.z
      }
    } else if (this.direction === Karol.Robot.SOUTH) {
      return {
        x: this.x,
        z: this.z + 1
      }
    } else if (this.direction === Karol.Robot.WEST) {
      return {
        x: this.x - 1,
        z: this.z
      }
    }
  }

  turnLeft () {
    if (this.direction === Karol.Robot.NORTH) {
      this.direction = Karol.Robot.WEST
    } else if (this.direction === Karol.Robot.EAST) {
      this.direction = Karol.Robot.NORTH
    } else if (this.direction === Karol.Robot.SOUTH) {
      this.direction = Karol.Robot.EAST
    } else if (this.direction === Karol.Robot.WEST) {
      this.direction = Karol.Robot.SOUTH
    }
  }

  turnRight () {
    if (this.direction === Karol.Robot.NORTH) {
      this.direction = Karol.Robot.EAST
    } else if (this.direction === Karol.Robot.EAST) {
      this.direction = Karol.Robot.SOUTH
    } else if (this.direction === Karol.Robot.SOUTH) {
      this.direction = Karol.Robot.WEST
    } else if (this.direction === Karol.Robot.WEST) {
      this.direction = Karol.Robot.NORTH
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

Karol.Robot.NORTH = 'North'
Karol.Robot.EAST = 'East'
Karol.Robot.SOUTH = 'South'
Karol.Robot.WEST = 'West'
