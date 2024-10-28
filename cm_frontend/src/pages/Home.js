import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Make sure you have Home.css in the same directory for styling

const Home = () => {
  const navigate = useNavigate();

  // Handlers for navigation
  const handleAddContact = () => {
    navigate('/add-contact');
  };

  const handleContactList = () => {
    navigate('/contact-list');
  };

  const handleVisualization = () => {
    navigate('/data-visualization');
  };

  return (
    <div className="home-container">
      <h1 className="welcome-message">Welcome to the Contact Manager</h1>
      
      {/* Container for the main image */}
      <div className="image-container">
        <img 
          src="https://i.imgur.com/P1rQ48R.png" 
          alt="Contact Manager" 
          className="image" 
        />
      </div>
      
      {/* Container for navigation buttons */}
      <div className="button-container">
        <button className="nav-button" onClick={handleAddContact}>Add Contact</button>
        <button className="nav-button" onClick={handleContactList}>Contact List</button>
        <button className="nav-button" onClick={handleVisualization}>View Data Visualization</button>
      </div>
    </div>
  );
};

export default Home;
