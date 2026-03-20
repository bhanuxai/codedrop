require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGO_URL)

app.get('/', (req, res) => {
  res.send("Server running")
})

app.listen(5000, () => console.log("Server started"))
const Data = require('./model')

function generateCode() {
  return Math.random().toString(36).substring(2, 8)
}

app.post('/save', async (req, res) => {
  const code = generateCode()
  const newData = new Data({ code, content: req.body.content })
  await newData.save()
  res.json({ code })
})

app.get('/get/:code', async (req, res) => {
  const data = await Data.findOne({ code: req.params.code })
  if (!data) return res.status(404).send("Not found")
  res.json(data)
})