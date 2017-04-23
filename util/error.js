Karol.Error = class {

  constructor (message, position, stack) {
    this.message = message
    this.position = position || {
      line: 0,
      column: 0
    }
    this.stack = stack || []
  }

  toString () {
    return 'Error: ' + this.message
  }

}
