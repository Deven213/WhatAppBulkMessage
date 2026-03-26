require('dotenv').config();
const mongoose = require('mongoose');
const Campaign = require('./models/Campaign');
const Contact = require('./models/Contact');
const Message = require('./models/Message');

const seedData = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB!');

    console.log('Clearing old data...');
    await Campaign.deleteMany({});
    await Contact.deleteMany({});
    await Message.deleteMany({});

    console.log('Inserting new sample data...');

    // 1. Create a Campaign
    const newCampaign = await Campaign.create({
      name: 'Spring Sale 2026',
      messageTemplate: 'Hello {{name}}! Check out our new Spring Sale. Use code {{code}} for 20% off!',
      totalContacts: 2,
      status: 'draft'
    });
    console.log(`Created Campaign: ${newCampaign.name}`);

    // 2. Create Contacts
    const contactsToInsert = [
      {
        campaignId: newCampaign._id,
        name: 'John Doe',
        phone: '1234567890',
        customData: {
          name: 'John Doe',
          code: 'SPRING20'
        }
      },
      {
        campaignId: newCampaign._id,
        name: 'Jane Smith',
        phone: '0987654321',
        customData: {
          name: 'Jane',
          code: 'SPRING20'
        }
      }
    ];

    const insertedContacts = await Contact.insertMany(contactsToInsert);
    console.log(`Inserted ${insertedContacts.length} Contacts`);

    // 3. Create Messages (Pending status)
    const messagesToInsert = insertedContacts.map(contact => ({
      campaignId: newCampaign._id,
      contactId: contact._id,
      phone: contact.phone,
      message: newCampaign.messageTemplate.replace('{{name}}', contact.customData.get('name')).replace('{{code}}', contact.customData.get('code')),
      status: 'pending'
    }));

    const insertedMessages = await Message.insertMany(messagesToInsert);
    console.log(`Inserted ${insertedMessages.length} Messages`);

    console.log('\n✅ Database successfully seeded!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
