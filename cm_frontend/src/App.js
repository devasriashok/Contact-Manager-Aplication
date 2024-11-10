// src/App.js
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import AddContact from './pages/AddContact';
import ContactList from './components/ContactList';
import DataVisualization from './components/DataVisualization';
import EmergencyAlert from './pages/EmergencyAlert';
import { ContactProvider } from './context/ContactContext';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('user');

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <ContactProvider>
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={isLoggedIn ? <Home userRole={userRole} onLogout={handleLogout} /> : <Navigate to="/signup" />} 
          />
          <Route 
            path="/add-contact" 
            element={isLoggedIn && userRole === 'admin' ? <AddContact /> : <Navigate to="/signup" />} 
          />
          <Route 
            path="/contact-list" 
            element={isLoggedIn ? <ContactList userRole={userRole} /> : <Navigate to="/signup" />} 
          />
          <Route 
            path="/data-visualization" 
            element={<DataVisualization />} 
          />
          <Route 
            path="/emergency-alert" 
            element={isLoggedIn ? <EmergencyAlert /> : <Navigate to="/signup" />} 
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
        </Routes>
      </Router>
    </ContactProvider>
  );
}

export default App;
