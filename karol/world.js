Karol.World = class {

  constructor (width, depth, height) {
    this.width = typeof width === 'number' && width > 0 ? width : 10
    this.depth = typeof depth === 'number' && depth > 0 ? depth : 10
    this.height = typeof height === 'number' && height > 0 ? height : 10
    this.data = []
    this.reset()
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
        this.data[x][z] = new Karol.WorldTile()
      }
    }
  }

}
