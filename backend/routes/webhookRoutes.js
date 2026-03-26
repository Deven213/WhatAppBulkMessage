const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Campaign = require('../models/Campaign');
const whatsappService = require('../services/whatsappService');

module.exports = (io) => {
  // Webhook for WhatsApp Business API (fallback just in case)
  router.post('/', async (req, res) => {
    // Process webhook...
    res.sendStatus(200);
  });

  // Since we use whatsapp-web.js, we track message_ack directly
  whatsappService.on('message_ack', async (msg, ack) => {
    try {
      // Find the message in our DB by waMessageId
      // ack: 1=Pending, 2=Sent, 3=Delivered, 4=Read
      const waId = msg.id._serialized;
      const messageDoc = await Message.findOne({ waMessageId: waId });
      if (!messageDoc) return;

      let statusUpdate = {};
      if (ack === 2) {
        statusUpdate.status = 'sent';
        statusUpdate.sentAt = new Date();
      } else if (ack === 3) {
        statusUpdate.status = 'delivered';
        statusUpdate.deliveredAt = new Date();
      } else if (ack === 4) {
        statusUpdate.status = 'read';
        statusUpdate.readAt = new Date();
      }

      if (Object.keys(statusUpdate).length > 0) {
        await Message.updateOne({ _id: messageDoc._id }, { $set: statusUpdate });
        
        // Update campaign stats
        const campaign = await Campaign.findById(messageDoc.campaignId);
        if (campaign) {
          if (ack === 2) campaign.sentCount += 1;
          if (ack === 3) {
             campaign.deliveredCount += 1;
             campaign.sentCount = Math.max(0, campaign.sentCount - 1);
          }
          if (ack === 4) {
             campaign.readCount += 1;
             campaign.deliveredCount = Math.max(0, campaign.deliveredCount - 1);
          }
          await campaign.save();

          // Inform frontend
          io.emit('campaign_update', campaign);
        }
      }
    } catch (err) {
      console.error('Error handling message_ack:', err);
    }
  });

  return router;
};
