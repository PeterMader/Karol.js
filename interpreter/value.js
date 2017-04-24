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
    if (this.type === Karol.Value.BOOLEAN) {
      return this.value ? 'true' : 'false'
    }
  }

  castToBoolean () {
    if (this.value === false || this.value === '' || this.value === 0 || this.value === null) {
      return Karol.Value.createFalse()
    }
    return Karol.Value.createTrue()
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

  static createBoolean (value) {
    return new Karol.Value(Karol.Value.BOOLEAN, !!value)
  }

  static createTrue () {
    return new Karol.Value(Karol.Value.BOOLEAN, true)
  }

  static createFalse () {
    return new Karol.Value(Karol.Value.BOOLEAN, false)
  }

}

Karol.Value.NUMBER = 'Number'
Karol.Value.STRING = 'String'
Karol.Value.BOOLEAN = 'Boolean'
Karol.Value.NULL = 'Null'
Karol.Value.ANY = 'Any'
