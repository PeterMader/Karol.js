Karol.EventEmitter = class {

  constructor () {
    this._events = {}
  }

  on (channel) {
    const listeners = Array.from(arguments).slice(1).filter((cb) => typeof cb === 'function')
    if (Array.isArray(this._events[channel])) {
      this._events[channel] = this._events[channel].concat(listeners)
    } else {
      this._events[channel] = listeners
    }
    return this
  }

  once (channel) {
    const listeners = Array.from(arguments).slice(1).filter((cb) => typeof cb === 'function').map((cb) => {
      const listener = (...args) => {
        self.remove(channel, listener)
        cb.apply(null, arguments)
      }
      return listener
    })
    if (Array.isArray(this._events[channel])) {
      this._events[channel] = this._events[channel].concat(listeners)
    } else {
      this._events[channel] = listeners
    }
    return this
  }

  emit (channel) {
    const args = Array.from(arguments).slice(1)
    if (Array.isArray(this._events[channel])) {
      const listeners = this._events[channel]
      let index
      for (index in listeners) {
        listeners[index].apply(null, args)
      }
    }
    return this
  }

  remove (channel) {
    const listenersToRemove = Array.from(arguments).slice(1).filter((cb) => typeof cb === 'function')
    if (Array.isArray(this._events[channel])) {
      const listeners = this._events[channel]
      let index
      for (index in listenersToRemove) {
        const listener = listenersToRemove[index]
        const removeIndex = listeners.indexOf(listener)
        if (removeIndex > -1) {
          this._events[channel].splice(removeIndex, 1)
        }
      }
    }
    return this
  }

  removeAll (channel) {
    if (Array.isArray(this._events[channel])) {
      delete this._events[channel]
    }
    return this
  }

}
