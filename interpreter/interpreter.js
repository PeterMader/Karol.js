Karol.Interpreter = class extends Karol.KarolParser {

  constructor () {
    super()
    this.parser = new Karol.Parser()
    this.prepareParser()
    this.procedures = {}
    this.callStack = [new Karol.Token({
      value: '<main>',
      position: {
        line: 0,
        column: 0
      }
    })]

    this.speed = 500
    this.running = false
    this.stopped = false
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

  addProcedure (procedure) {
    this.procedures[procedure.name] = procedure
  }

  createProcedure (name, block) {
    const {length} = block
    const procedure = new Karol.Procedure({
      cb: this.evaluateBlock.bind(this, block),
      name,
      userDefined: true
    })
    this.procedures[name] = procedure
  }

  cleanUp () {
    const {procedures} = this
    let index
    for (index in procedures) {
      if (procedures[index].userDefined) {
        delete procedures[index]
      }
    }

    // clear the call stack
    while (this.callStack.length > 1) {
      this.callStack.pop()
    }
    this.running = false
    this.stopped = false
  }

  throwTypeError (message, position) {
    throw new Karol.TypeError(message, position, this.callStack)
  }

  wait (ms) {
    // TODO: implement pause
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
  }

  unpause () {
    this.running = true
  }

  stop () {
    this.stopped = true
  }

  async evaluateBlock (block) {
    const {length} = block
    let value = Karol.Value.createNull()
    let i
    for (i = 0; i < length; i += 1) {
      const index = i
      await this.wait(this.speed)
      value = await this.evaluate(block[index])
      this.emit('statement')
    }
    return value
  }

  async evaluate (tree) {
    if (tree.type === Karol.Token.TOKEN_TYPE_NUMBER) {
      return Karol.Value.createNumber(tree.value)
    }
    if (tree.type === Karol.Token.TOKEN_TYPE_STRING) {
      return Karol.Value.createString(tree.value)
    }
    if (this.procedures.hasOwnProperty(tree.value)) {
      const procedure = this.procedures[tree.value]
      this.callStack.push(tree)
      const result = (await procedure.execute([])) || Karol.Value.createNull()
      this.callStack.pop()
      return result
    }
    if (tree.value === '(' && tree.operatorType === Karol.ParserSymbol.OPERATOR_TYPE_BINARY) {
      if (tree.first.type === Karol.Token.TOKEN_TYPE_IDENTIFIER) {
        if (this.procedures.hasOwnProperty(tree.first.value)) {
          const procedure = this.procedures[tree.first.value]
          const args = []
          let i
          for (i = 0; i < tree.args.length; i += 1) {
            args.push(await this.evaluate(tree.args[i]))
          }
          this.callStack.push(tree)
          const result = procedure.execute(args) || Karol.Value.createNull()
          this.callStack.pop()
          return result
        }
        this.throwTypeError(`undefined procedure "${tree.first.value}"`, tree.first.position)
      } else {
        this.throwTypeError(`expected identifier as procedure name, got token of type ${tree.first.type}`, tree.first.position)
      }
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
    } else if (tree.value === 'procedure') {
      const {first, block} = tree
      const name = first.value // first is an identifier and does not have to be evaulated
      if (this.procedures.hasOwnProperty(name)) {
        this.throwTypeError(`procedure "${name}" already exists`, first.position)
      }
      this.createProcedure(name, block)
    } else {
      this.throwTypeError(`undefined procedure "${tree.value}"`, tree.position)
    }
    return Karol.Value.createNull()
  }

}
