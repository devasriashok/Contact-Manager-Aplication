// routes/alerts.js
const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');

// Get all alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find();
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve alerts' });
  }
});

// Get alerts by contact ID
router.get('/contact/:contactId', async (req, res) => {
  try {
    const alerts = await Alert.find({ contactId: req.params.contactId });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve alerts for contact' });
  }
});

// Create a new alert
router.post('/', async (req, res) => {
  const { type, message, severity, contactId } = req.body;

  const alert = new Alert({
    type,
    message,
    severity,
    contactId,
  });

  try {
    const newAlert = await alert.save();
    res.status(201).json(newAlert);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create alert' });
  }
});

// Update an alert
router.put('/:id', async (req, res) => {
  try {
    const updatedAlert = await Alert.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedAlert);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update alert' });
  }
});

// Delete an alert
router.delete('/:id', async (req, res) => {
  try {
    await Alert.findByIdAndDelete(req.params.id);
    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete alert' });
  }
});

module.exports = router;
