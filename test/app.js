document.addEventListener('DOMContentLoaded', () => {

  const MyRobot = class extends Karol.Robot {

    toggleMark () {
      const tile = this.world.getTileAt(this.x, this.z)
      tile.hasMark = !tile.hasMark
    }

  }

  const canvas = document.getElementById('canvas')
  const world = new Karol.World(canvas)
  const robot = new MyRobot(world, 5, 5)

  robot.turnLeft()
  world.render()

  let i = 0
  const tick = () => {
    window.requestAnimationFrame(tick)
    if (++i % 20 === 0) {
      robot.turnLeft()
      robot.toggleMark()
      robot.step()
      robot.toggleMark()
      robot.step()
      world.render()
    }
  }

  window.requestAnimationFrame(tick)

})
