import App from "./js-jong/App.js"

const app = new App()

window.addEventListener('load', () => {
  app.resize()
  app.render()
})
