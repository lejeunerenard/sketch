import App from './app'

let app = new App()
document.body.appendChild(app.canvas)
app.start()

window.app = app
