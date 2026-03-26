const { Client, LocalAuth } = require('whatsapp-web.js');
const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

class WhatsAppService extends EventEmitter {
  constructor() {
    super();
    this.status = 'DISCONNECTED';
    this.qr = null;

    // ✅ FIX: Puppeteer cache path (ONLY on Render)
    if (process.platform === 'linux' && fs.existsSync('/opt/render')) {
      process.env.PUPPETEER_CACHE_DIR = "/opt/render/.cache/puppeteer";
    }

    this.initClient();
  }

  // ✅ Dynamically detect Chrome path (Platform Aware)
  getChromePath() {
    // Render.com specific path
    const renderPath = "/opt/render/.cache/puppeteer/chrome";
    
    // Check if we are on Linux (Render environment)
    if (process.platform === 'linux' && fs.existsSync(renderPath)) {
      try {
        const folders = fs.readdirSync(renderPath);
        if (folders.length > 0) {
          const latest = folders[0];
          return path.join(renderPath, latest, "chrome-linux64", "chrome");
        }
      } catch (err) {
        console.error("Chrome path detection failed (Linux):", err.message);
      }
    }
    
    // For Windows or other environments, return null to let puppeteer use its default/bundled browser
    return null;
  }

  initClient() {
    const chromePath = this.getChromePath();

    this.client = new Client({
      authStrategy: new LocalAuth(),

      puppeteer: {
        headless: true,

        // ✅ FIX: force correct Chrome path
        executablePath: chromePath || undefined,

        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu'
        ]
      }
    });

    this.setupEvents();
    this.client.initialize().catch(err => {
      console.error("INIT ERROR ❌", err);
    });
  }

  setupEvents() {
    this.client.on('qr', (qr) => {
      this.qr = qr;
      this.status = 'QR_READY';
      console.log('QR Code generated!');
      this.emit('qr', qr);
    });

    this.client.on('ready', () => {
      this.status = 'READY';
      this.qr = null;
      console.log('WhatsApp Client is ready! ✅');
      this.emit('ready');
    });

    this.client.on('authenticated', () => {
      this.status = 'AUTHENTICATED';
      this.emit('authenticated');
    });

    this.client.on('auth_failure', () => {
      console.log('Auth failure ❌');
      this.status = 'DISCONNECTED';
      this.emit('auth_failure');
    });

    this.client.on('disconnected', (reason) => {
      this.status = 'DISCONNECTED';
      console.log('WhatsApp disconnected:', reason);
      this.emit('disconnected');
    });

    this.client.on('message_ack', (msg, ack) => {
      this.emit('message_ack', msg, ack);
    });
  }

  getStatus() {
    return { status: this.status, qr: this.qr };
  }

  async logout() {
    console.log('Processing logout...');

    try {
      if (this.client && this.status !== 'DISCONNECTED') {
        // Wrap logout in a timeout to prevent hanging
        await Promise.race([
          this.client.logout(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Logout timeout')), 5000))
        ]).catch(err => console.log('Logout skip/timeout:', err.message));
      }
    } catch (err) {
      console.error('Error during client logout:', err);
    }

    try {
      if (this.client) {
        await this.client.destroy().catch(err => console.log('Destroy skip:', err.message));
      }
    } catch (err) {
      console.error('Error during client destroy:', err);
    }

    // ✅ Clear session
    if (fs.existsSync('.wwebjs_auth')) {
      try {
        fs.rmSync('.wwebjs_auth', { recursive: true, force: true });
      } catch {}
    }

    this.status = 'DISCONNECTED';
    this.qr = null;
    this.emit('disconnected');

    console.log('Re-initializing in 3 seconds...');
    setTimeout(() => this.initClient(), 3000);
  }

  async sendMessage(to, message) {
    if (this.status !== 'READY') {
      throw new Error('Client not ready');
    }

    let cleanNumber = to;

    if (!to.includes('@c.us')) {
      cleanNumber = to.replace(/[^0-9]/g, '');

      if (cleanNumber.length === 10) {
        cleanNumber = `91${cleanNumber}`;
      }
    }

    const formattedNumber = to.includes('@c.us')
      ? to
      : `${cleanNumber}@c.us`;

    return await this.client.sendMessage(formattedNumber, message);
  }
}

module.exports = new WhatsAppService();