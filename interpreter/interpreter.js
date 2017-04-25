Karol.Interpreter = class extends Karol.KarolParser {

  constructor () {
    super()
    this.parser = new Karol.Parser()
    this.prepareParser()
    this.nativeScope = {}
    this.context = new Karol.Context(new Karol.Token({
      value: '<main>',
      position: {
        line: 0,
        column: 0
      }
    }))

    this.speed = 500
    this.running = false
    this.stopped = false
  }

  setExecutionContext (context) {
    this.context = context
  }

  processBlock (endToken) {
    const {parser} = this
    const block = []
    while (parser.token.value !== endToken && parser.token.value !== '#end') {
      block.push(parser.expression(0))
    }
    if (parser.token.value === '#end') {
      throw new Karol.SyntaxError(`syntax error: unexpected end of script, expected ${endToken}`)
    }
    parser.nextToken(endToken)
    return block
  }

  addNativeProcedure (procedure) {
    this.nativeScope[procedure.name] = Karol.Value.createProcedure(procedure)
  }

  addNativeValue (name, value) {
    this.nativeScope[name] = value
  }

  createProcedure (name, block) {
    const {length} = block
    const procedure = new Karol.Procedure({
      cb: this.evaluateBlock.bind(this, block),
      name,
      userDefined: true
    })
    const value = Karol.Value.createProcedure(procedure)
    this.context.set(name, value)
    return value
  }

  cleanUp () {
    const {procedures} = this
    let index
    for (index in procedures) {
      if (procedures[index].userDefined) {
        delete procedures[index]
      }
    }

    this.context.clearCallStack()
    this.running = false
    this.stopped = false
  }

  throwTypeError (message, position) {
    throw new Karol.TypeError(message, position, this.context.callStack)
  }

  wait (ms) {
    if (!this.running && !this.stopped) {
      return new Promise((resolve) => {
        this.once('unpause', resolve)
      })
    }
    return new Promise((resolve) => {
      if (this.stopped) {
        throw 'Execution stopped'
      }
      window.setTimeout(resolve, ms)
    })
  }

  async run (source) {
    if (this.running) {
      return
    }
    this.emit('start')
    let result
    try {
      const trees = this.parser.parse(source)
      this.emit('parse')
      this.running = true
      result = await this.evaluateBlock(trees)
    } catch (e) {
      this.emit('error', e)
      result = e
    }
    this.cleanUp()
    this.emit('finish')
    return result
  }

  pause () {
    this.running = false
    this.emit('pause')
  }

  unpause () {
    this.running = true
    this.emit('unpause')
  }

  stop () {
    this.stopped = true
    this.emit('stop')
  }

  async evaluateBlock (block) {
    const {length} = block
    let value = Karol.Value.createNull()
    let i
    this.context.pushScope()
    for (i = 0; i < length; i += 1) {
      const index = i
      await this.wait(this.speed)
      value = await this.evaluate(block[index])
      this.emit('statement')
    }
    this.context.popScope()
    return value
  }

  async evaluate (tree) {
    if (tree.type === Karol.Token.TOKEN_TYPE_NUMBER) {
      return Karol.Value.createNumber(tree.value)
    }
    if (tree.type === Karol.Token.TOKEN_TYPE_STRING) {
      return Karol.Value.createString(tree.value)
    }
    if (tree.isAssignment) {
      const result = await this.evaluate(tree.second)
      this.context.set(tree.first.value, result)
      return result
    }
    if (tree.type === Karol.Token.TOKEN_TYPE_IDENTIFIER) {
      let value
      if (value = this.context.get(tree.value)) {
      } else if (this.nativeScope.hasOwnProperty(tree.value)) {
        value = this.nativeScope[tree.value]
      } else {
        this.throwTypeError(`undefined identifier ${tree.value}`)
      }

      if (value.type === Karol.Value.PROCEDURE) {
        const procedure = value.value
        this.context.callStack.push(tree)
        const result = (await procedure.execute([])) || Karol.Value.createNull()
        this.context.callStack.pop()
        return result
      } else {
        return value
      }
    }
    if (tree.value === '(' && tree.operatorType === Karol.ParserSymbol.OPERATOR_TYPE_BINARY) {
      let procedure
      if (tree.first.type === Karol.Token.TOKEN_TYPE_IDENTIFIER) {
        if (procedure = this.context.get(tree.first.value)) {
        } else if (this.nativeScope.hasOwnProperty(tree.first.value)) {
          procedure = this.nativeScope[tree.first.value]
        } else {
          this.throwTypeError(`undefined identifier ${tree.first.value}`)
        }
      } else {
        procedure = await this.evaluate(tree.first)
      }
      if (procedure.type === Karol.Value.PROCEDURE) {
        procedure = procedure.value
      } else {
        this.throwTypeError(`tried to call a value of type ${procedure.type}, expected a procedure`, tree.first.position)
      }
      const args = []
      let i
      for (i = 0; i < tree.args.length; i += 1) {
        args.push(await this.evaluate(tree.args[i]))
      }
      this.context.callStack.push(tree)
      const result = procedure.execute(args) || Karol.Value.createNull()
      this.context.callStack.pop()
      return result
    }
    if (tree.value === 'repeat') {
      const {block} = tree
      if (typeof tree.times !== 'undefined') {
        // repeat ... times structure
        const times = await this.evaluate(tree.times)
        if (times.type !== Karol.Value.NUMBER) {
          throw new Karol.TypeError(`repeat structure: expected ${Karol.Value.NUMBER}, got ${times.type}`)
        }
        let i
        for (i = 0; i < times.value; i += 1) {
          await this.evaluateBlock(block)
        }
      } else  {
        // repeat while ... structure
        while ((await this.evaluate(tree.condition)).castToBoolean().value) {
          await this.evaluateBlock(block)
        }
      }
      return Karol.Value.createNull()
    }
    if (tree.value === 'procedure') {
      const {first, block} = tree
      const name = first.value // first is an identifier and does not have to be evalated
      return this.createProcedure(name, block)
    }
    this.throwTypeError(`unexpected symbol ${tree.value}`, tree.position)
  }

}
