const Contact = require('../models/contact');
const mongoose = require('mongoose');


exports.getuserContact = async (req, res) => {
  try {
    const userId = req.query.userId;
    console.log(userId);

    const collectionName = `user_${userId}`;

   
    const collection = await mongoose.connection.db.collection(collectionName);
    const contacts = await collection.find({}).toArray();
    if (!contacts || contacts.length === 0) {
      return res.status(404).json({ error: 'No contacts found for the user' });
    }
    res.json({ contacts });
    console.log(contacts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};





exports.addContact = async (req, res) => {
  console.log(req.body);

  try {
    const { name, phone, email, address, userId } = req.body;

    const collectionName = `user_${userId}`;
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some((collection) => collection.name === collectionName);

    if (!collectionExists) {
      await mongoose.connection.db.createCollection(collectionName);
    }

    const contact = new Contact({
      name,
      phone,
      email,
      address,
      userId,
    });
    await mongoose.connection.db.collection(collectionName).insertOne(contact);

    res.json({ message: 'Contact added successfully', contact });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error', error });
  }
};



