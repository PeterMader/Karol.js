document.addEventListener('DOMContentLoaded', () => {

  const canvas = document.getElementById('canvas')
  const editor = document.getElementById('editor')
  const interpreter = new Karol.Interpreter()
  const karolConsole = new Karol.Console(document.getElementById('console-output'), document.getElementById('console-input'))
  const app = window.app = new Karol.Application(interpreter, canvas, karolConsole)
  app.render()
  document.getElementById('run').addEventListener('click', () => {
    interpreter.run(editor.value).then(console.log).catch(console.error)
  })

})
