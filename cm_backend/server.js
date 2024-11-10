const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Alert = require('./models/Alert'); 

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Database connection error:', err));

// Alert schema and model
const alertSchema = new mongoose.Schema({
  type: String,
  message: String,
});


// Route to create a new alert
app.post('/api/alerts', async (req, res) => {
  const { type, message } = req.body;
  try {
    const alert = new Alert({ type, message });
    await alert.save();
    res.status(201).send('Alert created');
  } catch (error) {
    res.status(500).send('Error creating alert');
  }
});

// Route to get all alerts
app.get('/api/alerts', async (req, res) => {
  try {
    const alerts = await Alert.find();
    res.json(alerts);
  } catch (error) {
    res.status(500).send('Error retrieving alerts');
  }
});
// Example: server.js (backend)
app.delete('/api/alerts/:id', async (req, res) => {
  const { id } = req.params;
  console.log('Attempting to delete alert with ID:', id); // Log to ensure the correct ID is being received

  try {
    const alert = await Alert.findByIdAndDelete(id);

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.status(200).json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Error deleting alert:', error);
    res.status(500).json({ message: 'Failed to delete alert' });
  }
});



// Import and use contact routes
const contactRoutes = require('./routes/contacts');
app.use('/api/contacts', contactRoutes);

// Import and use user routes
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
