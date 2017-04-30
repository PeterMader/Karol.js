document.addEventListener('DOMContentLoaded', () => {

  const MyRobot = class extends Karol.Robot {

    toggleMark () {
      const tile = this.world.getTileAt(this.x, this.z)
      tile.hasMark = !tile.hasMark
    }

  }

  const canvas = document.getElementById('canvas')
  const button = document.getElementById('button')
  const world = new Karol.World(canvas)
  const robot = new MyRobot(world, 5, 5)

  robot.turnLeft()
  world.render()

  let i = 0, paused = false
  const tick = () => {
    if (++i % 20 === 0 && !paused) {
      robot.turnLeft()
      robot.toggleMark()
      robot.step()
      world.render()
    }
    window.requestAnimationFrame(tick)
  }

  window.requestAnimationFrame(tick)

  canvas.addEventListener('click', () => paused = !paused)

  document.addEventListener('keyup', (e) => {
    try {
      if (e.key === 'l') {
        robot.layDown()
      } else if (e.key === 'p') {
        robot.pickUp()
      } else if (e.key === 'b') {
        robot.setBarrier()
      } else if (e.key === 'r') {
        robot.removeBarrier()
      } else if (e.key === 'm') {
        robot.toggleMark()
      } else if (e.key === 'x') {
        world.reset()
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        robot.step()
      } else if (e.key === 'ArrowLeft') {
        robot.turnLeft()
      } else if (e.key === 'ArrowRight') {
        robot.turnRight()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
      }
    } catch (e) {
      /* let every error fail silently */
    }
    if (paused) {
      world.render()
    }
  })

  button.addEventListener('click', () => {
    button.href = world.createImage()
  })

})
