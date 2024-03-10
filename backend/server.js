const express = require('express')
let app = express()

const db = require('./src/controllers/db')

const port = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('this is my server')
})

// app.get('/a', async (req, res) => {
//   await db.helpers.addPerson('test', 123)
//   let data = await db.helpers.getPeople()
//   res.json(data)
// })




async function initDb() {
  // await db.helpers.init()

  // run helper script to create tables

}

// This starts up the server
// TODO: make sure that the docker container running postgres is always up before the server starts
initDb().then(() => {
  app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`)
  })
})
