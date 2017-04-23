Karol.SyntaxError = class extends Karol.Error {

  toString () {
    return 'Syntax error: ' + this.message
  }

}
