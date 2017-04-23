Karol.Value = class {

  constructor (type, value) {
    this.type = type
    this.value = value
  }

  toString () {
    if (this.type === Karol.Value.NULL) {
      return 'null'
    }
    if (this.type === Karol.Value.NUMBER) {
      return this.value.toString()
    }
    if (this.type === Karol.Value.STRING) {
      return '"' + this.value.toString() + '"'
    }
  }

  static createNull () {
    return new Karol.Value(Karol.Value.NULL, null)
  }

  static createNumber (number) {
    return new Karol.Value(Karol.Value.NUMBER, Number(number))
  }

  static createString (string) {
    return new Karol.Value(Karol.Value.STRING, String(string))
  }

}

Karol.Value.NUMBER = 'Number'
Karol.Value.STRING = 'String'
Karol.Value.NULL = 'Null'
Karol.Value.ANY = 'Any'
