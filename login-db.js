const express = require("express")
const cors = require("cors")

const app = express()

const IP_LOOPBACK = "localhost"
const IP_LOCAL = "172.28.0.1"
const PORT = 3333

const user_db = {}

app.use(express.urlencoded({ extended: false })) // to support URL-encoded bodies
app.use(express.json()) // to support JSON-encoded bodies
app.use(cors())

app.get("/database", (req, res) => {
  res.send(user_db)
})

app.post("/register/:username", (req, res) => {
  const username = req.params.username
  if (user_db.hasOwnProperty(username)) {
    res.status(409).send(`${username} is already chosen`)
  } else {
    const password = req.body[username]
    user_db[username] = password
    res.send(`${username} is well registered.`)
  }
})

app.post("/login/:username", (req, res) => {
  const username = req.params.username
  const password = req.body[username]
  if (password === user_db[username]) {
    res.send(`login successful`)
  } else {
    res.status(401).send(`try again`)
  }
})

app.listen(PORT, IP_LOOPBACK, () => {
  console.log(`APP listening at http://${IP_LOOPBACK}:${PORT}/`)
})
