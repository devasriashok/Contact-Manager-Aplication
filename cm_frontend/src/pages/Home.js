import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './Home.css';

const Home = ({ userRole, onLogout }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState("Welcome to the Contact Manager!");

  useEffect(() => {
    const interval = setInterval(() => {
      setMessages((prevMessage) =>
        prevMessage === "Welcome to the Contact Manager!"
          ? "Manage your contacts easily!"
          : "Welcome to the Contact Manager!"
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [messages]);

  const handleAddContact = () => {
    navigate('/add-contact');
  };

  const handleContactList = () => {
    navigate('/contact-list');
  };

  const handleVisualization = () => {
    navigate('/data-visualization');
  };

  const handleEmergencyAlert = () => {
    navigate('/emergency-alert');
  };

  return (
    <div className="home-container">
      <button className="logout-button nav-button" onClick={onLogout}>
        Logout
      </button>

      <h1 className="welcome-message">{messages}</h1>
      
      <div className="image-container">
        <img 
          src="https://i.imgur.com/P1rQ48R.png" 
          alt="Contact Manager" 
          className="image" 
        />
      </div>
      
      <div className="button-container">
        <button className="nav-button" onClick={handleAddContact} disabled={userRole !== 'admin'}>
          Add Contact
        </button>
        <button className="nav-button" onClick={handleContactList}>
          Contact List
        </button>
        <button className="nav-button" onClick={handleVisualization}>
          View Data Visualization
        </button>
        {userRole === 'admin' && (
          <button className="nav-button" onClick={handleEmergencyAlert}>
             Alerts
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
