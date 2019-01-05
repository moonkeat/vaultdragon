const mongoose = require('mongoose');

const objectSchema = new mongoose.Schema({
  key: String,
  value: String,
}, { timestamps: true });

const Object = mongoose.model('Object', objectSchema);

module.exports = Object;
