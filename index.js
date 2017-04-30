((factory) => {
  module.exports = factory()
  if (typeof window === 'object') {
    window.Karol = module.exports
  }
})(() => {
  return {
    Robot: require('./lib/robot.js'),
    World: require('./lib/world.js'),
    WorldTile: require('./lib/world-tile.js')
  }
})
