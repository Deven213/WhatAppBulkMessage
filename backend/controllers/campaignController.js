const Campaign = require('../models/Campaign');
const Contact = require('../models/Contact');
const Message = require('../models/Message');
const whatsappService = require('../services/whatsappService');
const xlsx = require('xlsx');
const fs = require('fs');

exports.createCampaign = async (req, res) => {
  try {
    const { name, messageTemplate } = req.body;
    const campaign = new Campaign({ name, messageTemplate });
    await campaign.save();
    res.status(201).json(campaign);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

<<<<<<< HEAD
=======
exports.updateCampaign = async (req, res) => {
  try {
    const { name, messageTemplate } = req.body;
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id, 
      { name, messageTemplate }, 
      { new: true }
    );
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

>>>>>>> master
exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    const contacts = await Contact.find({ campaignId: req.params.id });
    const messages = await Message.find({ campaignId: req.params.id });
    res.json({ campaign, contacts, messages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.uploadContacts = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    let validContacts = [];

    for (let row of sheet) {
      // Find the phone key dynamically (case insensitive)
      let phoneKey = Object.keys(row).find(k => {
        let lower = k.toLowerCase().trim();
        return lower === 'phone' || lower === 'number' || lower === 'contact' || lower === 'phone number' || lower === 'whatsapp';
      });

      // Find the name key dynamically
      let nameKey = Object.keys(row).find(k => {
        let lower = k.toLowerCase().trim();
        return lower === 'name' || lower === 'first name' || lower === 'fullname' || lower === 'client';
      });

      let rawPhone = phoneKey ? row[phoneKey] : null;
      let rawName = nameKey ? row[nameKey] : '';

      if (rawPhone) {
        // Strip out non-numeric chars from phone
        let phone = String(rawPhone).replace(/[^0-9]/g, '');
        
        if (phone.length >= 7) { // basic validation for phone number length
          // Filter out the phone and name keys from other custom fields
          const customData = { ...row };
          if (phoneKey) delete customData[phoneKey];
          if (nameKey) delete customData[nameKey];

          validContacts.push({
            campaignId,
            phone,
            name: String(rawName || '').trim(),
            customData: customData
          });
        }
      }
    }

    if (validContacts.length > 0) {
      await Contact.insertMany(validContacts);
      await Campaign.findByIdAndUpdate(campaignId, { $inc: { totalContacts: validContacts.length } });
    }

    fs.unlinkSync(file.path); // remove temp file

    res.json({ message: 'Contacts imported successfully', count: validContacts.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sendCampaign = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const campaign = await Campaign.findById(campaignId);

    if (whatsappService.status !== 'READY') {
      return res.status(400).json({ error: 'WhatsApp client is not ready. Scan QR first.' });
    }

    if (campaign.status === 'sending' && req.query.force !== 'true') {
      return res.status(400).json({ error: 'Campaign is already sending. If it is stuck, use Force Restart.' });
    }

    const contacts = await Contact.find({ campaignId });
    if (contacts.length === 0) {
      return res.status(400).json({ error: 'No contacts found for this campaign.' });
    }

    campaign.status = 'sending';
    await campaign.save();

    res.json({ message: 'Campaign started successfully' });

    // Inform frontend via socket
    req.io.emit('campaign_update', campaign);

    // Send messages in background, safely detached from the Express response
    (async () => {
      let failed = 0;
      let sent = 0;
      try {
        for (let contact of contacts) {
          // 1. Replace variables in template
          let finalMessage = campaign.messageTemplate;
          
          // replace {{name}}
          if (contact.name) finalMessage = finalMessage.replace(/{{name}}/gi, contact.name);
          
          // replace other custom variables
          if (contact.customData) {
            // Safely handle both Mongoose Maps and plain objects
            const dataObj = contact.customData instanceof Map ? Object.fromEntries(contact.customData) : contact.customData;
            for (let [key, val] of Object.entries(dataObj)) {
              if (val == null) continue;
              const regex = new RegExp(`{{${key}}}`, 'gi');
              finalMessage = finalMessage.replace(regex, val);
            }
          }

          // 2. Add random delay to avoid ban (3 to 10 seconds)
          const delayMs = Math.floor(Math.random() * (10000 - 3000 + 1)) + 3000;
          await new Promise(resolve => setTimeout(resolve, delayMs));

          try {
            const result = await whatsappService.sendMessage(contact.phone, finalMessage);
            sent++;
            
            // Ensure result structure matches expectations for tracking
            const msgDoc = new Message({
              campaignId,
              contactId: contact._id,
              phone: contact.phone,
              message: finalMessage,
              waMessageId: result?.id?._serialized || 'unknown', // safely access
              status: 'sent',
              sentAt: new Date()
            });
            await msgDoc.save();
            
          } catch (err) {
            // Failed
            failed++;
            const msgDoc = new Message({
              campaignId,
              contactId: contact._id,
              phone: contact.phone,
              message: finalMessage,
              status: 'failed',
              failedReason: err.message,
              failedAt: new Date()
            });
            await msgDoc.save();
          }

          // Update campaign stats
          const currentCampaign = await Campaign.findById(campaignId);
          currentCampaign.failedCount = failed;
          currentCampaign.sentCount = sent;
          await currentCampaign.save();
          
          req.io.emit('campaign_update', currentCampaign);
        }

        const finalCampaign = await Campaign.findById(campaignId);
        finalCampaign.status = 'completed';
        await finalCampaign.save();
        req.io.emit('campaign_update', finalCampaign);

      } catch (bgError) {
        console.error('Fatal error in background sending loop:', bgError);
      }
    })();

  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ error: err.message });
    } else {
      console.error('Error occurred after res sent:', err.message);
    }
  }
};

exports.duplicateCampaign = async (req, res) => {
  try {
    const oldCampaign = await Campaign.findById(req.params.id);
    if (!oldCampaign) return res.status(404).json({ error: 'Campaign not found' });

    // 1. Clone Campaign Document
    const newCampaign = new Campaign({
      name: `${oldCampaign.name} (Resend)`,
      messageTemplate: oldCampaign.messageTemplate,
      totalContacts: oldCampaign.totalContacts,
      status: 'draft'
    });
    await newCampaign.save();

    // 2. Clone Contacts exactly as they were
    const oldContacts = await Contact.find({ campaignId: oldCampaign._id });
    const clonedContacts = oldContacts.map(c => ({
      campaignId: newCampaign._id,
      name: c.name,
      phone: c.phone,
      customData: c.customData
    }));

    if (clonedContacts.length > 0) {
      await Contact.insertMany(clonedContacts);
    }

    res.json(newCampaign);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
