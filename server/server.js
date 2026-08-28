require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(express.json())

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}))

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

const Data = require('./model')

function generateCode() {
  return Math.random().toString(36).substring(2, 8)
}

app.get('/', (req, res) => {
  res.send("Server running")
})

app.post('/save', async (req, res) => {
  try {
    const { content } = req.body
    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Content is required" })
    }
    let code = generateCode()
    let exists = await Data.exists({ code })
    while (exists) {
      code = generateCode()
      exists = await Data.exists({ code })
    }
    const newData = new Data({ code, content })
    await newData.save()
    res.json({ code })
  } catch (err) {
    console.error("Save error:", err)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.get('/get/:code', async (req, res) => {
  try {
    const data = await Data.findOne({ code: req.params.code }).lean()
    if (!data) return res.status(404).json({ error: "Code not found or expired" })
    res.json(data)
  } catch (err) {
    console.error("Get error:", err)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.listen(5000, () => console.log("Server started on port 5000"))

