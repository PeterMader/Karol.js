Karol.World = class {

  constructor () {
    this.width = 10
    this.height = 10
    this.depth = 10
    this.data = []
    let x, z
    for (x = 0; x < this.width; x += 1) {
      this.data[x] = []
      for (z = 0; z < this.depth; z += 1) {
        this.data[x][z] = new Karol.WorldTile()
      }
    }
  }

  isOutOfBounds (x, z) {
    return x < 0 || z < 0 || x >= this.width || z >= this.depth
  }

  getTileAt (x, z) {
    return this.data[x][z] || null
  }

}
