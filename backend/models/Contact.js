const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  name: { type: String },
  phone: { type: String, required: true },
  customData: { type: Map, of: String }, // For dynamic variables like {{product}}, {{link}}
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', contactSchema);
