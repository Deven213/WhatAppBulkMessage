const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  waMessageId: { type: String }, // WhatsApp Message ID from API
  status: { 
    type: String, 
    enum: ['pending', 'sent', 'delivered', 'read', 'failed'], 
    default: 'pending' 
  },
  failedReason: { type: String },
  sentAt: { type: Date },
  deliveredAt: { type: Date },
  readAt: { type: Date },
  failedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
