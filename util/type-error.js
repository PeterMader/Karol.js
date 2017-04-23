Karol.TypeError = class extends Karol.Error {

  toString () {
    return 'Type error: ' + this.message
  }

}
