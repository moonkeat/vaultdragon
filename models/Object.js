const mongoose = require('mongoose');

const objectSchema = new mongoose.Schema({
  key: String,
  value: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

const Object = mongoose.model('Object', objectSchema);

module.exports = Object;
