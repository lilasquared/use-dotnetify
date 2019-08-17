const proxy = require("http-proxy-middleware")

module.exports = app => {
  app.use(proxy("/dotnetify", { target: "http://localhost:5000" }))
  app.use(proxy("/dotnetify", { target: "ws://localhost:5000", ws: true }))
}
