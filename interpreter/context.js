Karol.Context = class {

  constructor (main) {
    this.scope = {}
    this.callStack = [main]
  }

  pushScope () {
    this.scope = {
      [Karol.Context.PARENT_SCOPE]: this.scope
    }
  }

  popScope () {
    this.scope = this.scope[Karol.Context.PARENT_SCOPE]
  }

  clearCallStack () {
    while (this.callStack.length > 1) {
      this.callStack.pop()
    }
  }

  get (name) {
    let scope = this.scope
    do {
      if (scope.hasOwnProperty(name)) {
        return scope[name]
      }
    } while (scope = scope[Karol.Context.PARENT_SCOPE])
    return null
  }

  set (name, value) {
    this.scope[name] = value
  }

}

Karol.Context.PARENT_SCOPE = Symbol('Parent scope')
