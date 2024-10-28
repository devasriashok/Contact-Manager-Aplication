// routes/contacts.js
const express = require('express');
const Contact = require('../models/Contact');
const router = express.Router();

// Create a new contact
router.post('/', async (req, res) => {
  const { name, email, phone, additionalInfo, type } = req.body;  // Updated to include type

  try {
    const newContact = new Contact({ name, email, phone, additionalInfo, type });  // Pass type to the model
    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: 'Error creating contact' });
  }
});

// Get all contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching contacts' });
  }
});

// Update a contact by ID
router.put('/:id', async (req, res) => {
  const { name, email, phone, additionalInfo, type } = req.body;  // Updated to include type

  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, additionalInfo, type },  // Pass type to the model
      { new: true }
    );
    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({ error: 'Error updating contact' });
  }
});

// Delete a contact by ID
router.delete('/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting contact' });
  }
});

module.exports = router;
