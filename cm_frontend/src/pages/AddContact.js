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
      setCustomType('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        <button type="button" onClick={handleAddType}>Add Type</button>

        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />

        <label>Phone:</label>
        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />

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
  );
}

export default AddContact;
