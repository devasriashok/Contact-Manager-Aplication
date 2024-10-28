import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import AddContact from './pages/AddContact';
import ContactList from './components/ContactList';
import DataVisualization from './components/DataVisualization';
import { ContactProvider } from './context/ContactContext';
// src/index.js or src/App.js
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track if user is logged in

  const handleLogin = () => {
    setIsLoggedIn(true); // Set logged in state to true
  };

  return (
    <ContactProvider>
    <Router>
      <nav>
        {/* Only show navigation if user is logged in */}
        {isLoggedIn && (
          <>
            
          </>
        )}
      </nav>
      <Routes>
        {/* Redirect to Home if logged in */}
        <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/signup" />} />
        <Route path="/add-contact" element={isLoggedIn ? <AddContact /> : <Navigate to="/signup" />} />
        <Route path="/contact-list" element={isLoggedIn ? <ContactList /> : <Navigate to="/signup" />} />
        <Route path="/data-visualization" element={<DataVisualization />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} /> {/* Pass handleLogin to Login */}
      </Routes>
    </Router>
    </ContactProvider>
  );
}

export default App;
