import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        username,
        password,
      });

      if (response.status === 200) {
        // Successful login
        alert(response.data.message); // Show success message
        onLogin(); // Call the onLogin prop to update logged-in state
        navigate('/'); // Redirect to home page
      }
    } catch (error) {
      setErrorMessage(error.response.data.message || 'Login failed! Please try again.');
    }
  };

  // Define the handleLogout function to navigate to SignUp page
  const handleLogout = () => {
    navigate('/signup'); // Redirect to the Sign-Up page
  };

  return (
    <div className="login-page">
      {/* Top-right corner Logout button */}
      <div className="logout-container">
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      {/* Login box below */}
      <div className="login-container">
        <h2>Login</h2>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <form onSubmit={handleLogin}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
