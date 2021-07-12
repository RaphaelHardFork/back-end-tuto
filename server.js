// import library
const express = require("express")

// app definition
const app = express()

const IP_LOOPBACK = "localhost"
const IP_LOCAL = "172.28.0.1"
const PORT = 3333

// type some action and routes
app.get("/", (req, res) => {
  res.send(`Welcome ${req.ip} to the server`)
})

app.post("/", (req, res) => {
  res.send(`This route do not accept post request`)
})

app.get("/hello", (req, res) => {
  res.send("Hello world!")
})

// utilisation of REGEX
app.get("/ab?cd", (req, res) => {
  res.send("ab?cd")
})

// utilisation of parameters
app.get("/hello/:name", (req, res) => {
  res.send(`Hello ${req.params.name}, welcome to the server`)
})

// utilisation of the next() function
app.get(
  "/next",
  (req, res, next) => {
    console.log(
      `${req.ip} attempt to connect to "${req.originalUrl}" with method ${req.method}`
    )
    next()
  },
  (req, res) => {
    res.send(`You just use the next function ${req.ip}`)
  }
)

// start the server
app.listen(PORT, IP_LOOPBACK, () => {
  console.log(`APP listening at http://${IP_LOOPBACK}:${PORT}/`)
})
