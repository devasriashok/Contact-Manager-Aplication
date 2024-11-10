import React, { useState, useContext, useEffect } from 'react';
import { ContactContext } from '../context/ContactContext';  // Import ContactContext
import './EmergencyAlert.css';  // Import the CSS file

function EmergencyAlert() {
  const { contacts, sendEmergencyAlert} = useContext(ContactContext); // Ensure deleteEmergencyAlert is available

  const [selectedContactType, setSelectedContactType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [error, setError] = useState('');
  const [alerts, setAlerts] = useState([]); // State to store emergency alerts

  useEffect(() => {
    // Fetch existing alerts when the component mounts
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/alerts');  // Assuming you have an endpoint to fetch alerts
      const data = await response.json();
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const handleSendAlert = () => {
    if (!selectedContactType || !alertMessage.trim()) {
      setError("Please select a contact type and enter an alert message.");
      return;
    }
    
    setError('');
    sendEmergencyAlert(selectedContactType, alertMessage);

    // Optionally, refresh the list of alerts after sending
    fetchAlerts();

    // Reset the fields
    setAlertMessage('');
    setSelectedContactType('');
    alert('Alert sent successfully!');
  };

 

  return (
    <div className="emergency-alert-container">
      <h1>Send Alert!</h1>

      {/* Select a contact type */}
      <select
        className="emergency-alert-select"
        value={selectedContactType}
        onChange={(e) => setSelectedContactType(e.target.value)}
      >
        <option value="">Select Contact Type</option>
        {Object.keys(contacts).map(contactType => (
          <option key={contactType} value={contactType}>
            {contactType}
          </option>
        ))}
      </select>

      {/* Enter alert message */}
      <textarea
        className="emergency-alert-textarea"
        placeholder="Enter a message"
        value={alertMessage}
        onChange={(e) => setAlertMessage(e.target.value)}
      />

      {/* Button to send alert */}
      <button className="emergency-alert-button" onClick={handleSendAlert}>
        Send an Alert/Information
      </button>

      {/* Display error message if validation fails */}
      {error && <div className="alert-message">{error}</div>}

      {/* Display existing alerts */}
      <div className="alert-list">
        
        {alerts.length > 0 ? (
          alerts.map(alert => (
            <div key={alert._id} className="alert-item">
              
            </div>
          ))
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
}

export default EmergencyAlert;
