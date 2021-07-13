// import library
const { ethers } = require("ethers")
const express = require("express")
const fsPromises = require("fs/promises")

// app definition
const app = express()

const IP_LOOPBACK = "localhost"
const IP_LOCAL = "172.28.0.1"
const PORT = 3333
const LOG_FILE = "access-log.txt"

const PROVIDER = new ethers.providers.InfuraProvider(4) // 4 = rinkeby

// access log file
/*
TODO: status, gestion d'erreur, fichier de log erreur, ...
res.status(XXX).send()
*/
const logger = async (req) => {
  try {
    const date = new Date()
    const log = `${date.toUTCString()} / ${req.method}\n"${
      req.originalUrl
    }" from ${req.ip} ${req.headers["user-agent"]}\n`
    await fsPromises.appendFile(LOG_FILE, log, "utf-8")
    console.log(log)
  } catch (e) {
    console.error(`Error: can't write in ${LOG_FILE}`)
  }
}

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

// utilisation of parameters
app.get(
  "/hello/:name",
  async (req, res, next) => {
    await logger(req)
    next()
  },
  (req, res) => {
    res.send(`Hello ${req.params.name}, welcome to the server`)
  }
)

// get ETH balance
app.get(
  "/balance/:address",
  async (req, res, next) => {
    await logger(req)
    next()
  },
  async (req, res) => {
    const address = req.params.address.toLowerCase()
    if (ethers.utils.isAddress(address)) {
      const balance = await PROVIDER.getBalance(address)
      res.send(ethers.utils.formatEther(balance) + " ETH")
    } else {
      res.send(`${address} is not an ethereum address`)
    }
  }
)

app.post("/register", (req, res, next) => {})

// start the server
app.listen(PORT, IP_LOOPBACK, () => {
  console.log(`APP listening at http://${IP_LOOPBACK}:${PORT}/`)
})
