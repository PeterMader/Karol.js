((factory) => {
  if (typeof window === 'object') {
    window.Karol = factory()
  } else if (typeof module === 'object' && typeof module.exports === 'object' && typeof require === 'function') {
    module.exports = factory()
  }
})(() => {
  return {
    Robot: require('./lib/robot.js'),
    World: require('./lib/world.js'),
    WorldTile: require('./lib/world-tile.js')
  }
})
