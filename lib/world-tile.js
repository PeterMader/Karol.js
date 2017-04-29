const WorldTile = module.exports = class {

  constructor (x, z) {
    this.x = x || 0
    this.z = z || 0
    this.blocks = 0
    this.hasMark = false
    this.hasBarrier = false
  }

}
