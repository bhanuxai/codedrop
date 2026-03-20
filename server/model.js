const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
  code: String,
  content: String,
  createdAt: { type: Date, default: Date.now, expires: 3600 }
})

module.exports = mongoose.model("Data", dataSchema)