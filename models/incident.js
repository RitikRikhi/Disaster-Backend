const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  position: { type: [Number], required: true },
  priority: { type: String, required: true },
  assignedUnits: { type: [String], default: [] },
  aiRecommendation: { type: String },
  log: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Incident', incidentSchema);
