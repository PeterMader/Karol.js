Karol.Procedure = class {

  constructor (options) {
    this.cb = options.cb
    this.expectedArguments = Array.isArray(options.expectedArguments) ? options.expectedArguments : []
    this.userDefined = !!options.userDefined
    this.name = options.name || '<unnamed procedure>'
  }

  execute (args) {
    const {cb, expectedArguments} = this
    let index
    for (index in expectedArguments) {
      const expected = expectedArguments[index]
      const real = args[index]
      if (expected.optional) {
        continue
      }
      if (!real) {
        throw new Karol.TypeError(`procedure ${this.name}: missing argument ${index}, expected it to be of type ${expectedArguments[index]}`)
      }
      if (expected.type !== real.type && expected.type !== Karol.Value.ANY) {
        throw new Karol.TypeError(`procedure ${this.name}: expected argument ${index} to be of type ${expectedArguments[index]}, got type ${args[index].type}`)
      }
    }
    return cb(args)
  }

}
