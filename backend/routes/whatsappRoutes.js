const express = require('express');
const router = express.Router();
const whatsappService = require('../services/whatsappService');

module.exports = (io) => {

  // ✅ Get WhatsApp status
  router.get('/status', (req, res) => {
    try {
      res.json(whatsappService.getStatus());
    } catch (err) {
      res.status(500).json({ error: 'Failed to get status' });
    }
  });

  // ✅ Logout and reset session
  router.post('/logout', async (req, res) => {
    try {
      await whatsappService.logout();
      res.json({
        success: true,
        message: 'Logging out and generating new QR code...'
      });
    } catch (err) {
      res.status(500).json({ error: 'Logout failed' });
    }
  });

  // ✅ SOCKET EVENTS (SAFE BINDING)
  whatsappService.removeAllListeners(); // prevent duplicate listeners

  whatsappService.on('qr', (qr) => {
    console.log("QR emitted");
    io.emit('whatsapp_qr', qr);
  });

  whatsappService.on('ready', () => {
    console.log("WhatsApp ready");
    io.emit('whatsapp_ready');
  });

  whatsappService.on('disconnected', () => {
    console.log("WhatsApp disconnected");
    io.emit('whatsapp_disconnected');
  });

  whatsappService.on('auth_failure', () => {
    console.log("Auth failure");
    io.emit('whatsapp_auth_failure');
  });

  return router;
};