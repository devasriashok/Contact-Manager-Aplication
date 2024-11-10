import React, { useState } from 'react';
import axios from 'axios';
import './AddContact.css';

function AddContact({ onContactAdded }) {
  const [customType, setCustomType] = useState(''); // New custom contact type
  const [contactTypes, setContactTypes] = useState(['Teacher', 'Student', 'Worker', 'Admin']); // Existing types
  const [selectedType, setSelectedType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    additionalInfo: '',
  });

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setFormData({ name: '', email: '', phone: '', additionalInfo: '' });
  };

  const handleCustomTypeChange = (e) => {
    setCustomType(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddType = () => {
    if (customType && !contactTypes.includes(customType)) {
      setContactTypes([...contactTypes, customType]);
      setSelectedType(customType); // Automatically select the new type
      setCustomType(''); // Clear the input after adding
    }
  };

  const validateForm = () => {
    const { name, email, phone } = formData;
    const phoneRegex = /^[0-9]{10}$/; // Regex for 10-digit phone number
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex for valid email format
    const nameRegex = /^[A-Za-z]+$/; // Regex to ensure name contains only alphabets

    if (!name || !email || !phone || !selectedType) {
      alert('All fields are mandatory.');
      return false;
    }
    if (!nameRegex.test(name)) {
      alert('Name must contain only alphabetic characters.');
      return false;
    }
    if (!phoneRegex.test(phone)) {
      alert('Phone number must be exactly 10 digits.');
      return false;
    }
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Prevent submission if validation fails

    try {
      await axios.post('http://localhost:5000/api/contacts', {
        type: selectedType,
        ...formData,
      });
      alert('Contact added successfully!');
      setSelectedType('');
      setFormData({ name: '', email: '', phone: '', additionalInfo: '' });
      if (onContactAdded) onContactAdded(); // Refresh contact list
    } catch (error) {
      console.error('Failed to add contact', error);
      alert('Error adding contact');
    }
  };

  return (
    <div className="add-contact-form">
      <div className="form-box">
        <h2>Add Contact</h2>
        <form onSubmit={handleSubmit}>
          <label>Contact Type:</label>
          <select value={selectedType} onChange={handleTypeChange} required>
            <option value="">Select Type</option>
            {contactTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Or enter custom type"
            value={customType}
            onChange={handleCustomTypeChange}
          />
          <button type="button" onClick={handleAddType}>Add Type</button><br /><br />

          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />

          {selectedType && (
            <>
              <label>{selectedType} Info:</label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
              />
            </>
          )}

          <button type="submit">Add Contact</button>
        </form>
      </div>
    </div>
  );
}

export default AddContact;
