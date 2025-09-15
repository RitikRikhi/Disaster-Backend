const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  status: { type: String, required: true },
  location: { type: String, required: true },
  position: { type: [Number], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
