const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, index: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 }
})

module.exports = mongoose.model("Data", dataSchema)