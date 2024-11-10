import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';

const images = [
  'https://images.unsplash.com/photo-1462536943532-57a629f6cc60?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1537444532052-2afbf769b76c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D']
function Signup({ setUser }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    role: 'user', // Default role
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(intervalId);
  }, []);

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Client-side validation
  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (!/[A-Za-z]/.test(formData.username)) {
      newErrors.username = 'Username must contain at least one alphabet';
    } else if (formData.username.length < 3 || formData.username.length > 15) {
      newErrors.username = 'Username must be between 3 and 15 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[\w.-]+@[a-zA-Z\d-]+\.[a-zA-Z]{2,4}$/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, a number, and a special character';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/users/signup', formData);
      if (response.status === 201) {
        alert('Signup successful! You can now log in.');
        setUser({ username: formData.username, role: formData.role });
        navigate('/login'); // Redirect to login after successful signup
      } else {
        alert('Unexpected error occurred during signup');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Error: ${error.response.data.message}`);
      } 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      {/* Left side - Image */}
      <div 
        className="signup-image"
        style={{ 
          backgroundImage: `url(${images[currentImageIndex]})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          minHeight: '100vh',
          width: '50%',
        }}
      ></div>

      {/* Right side - Signup Form */}
      <div className="signup-form">
        <h1 align="center">Contact Manager Application</h1>
        <h2>SIGN UP</h2>
        <form onSubmit={handleSubmit} noValidate>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
          {errors.username && <p className="error">{errors.username}</p>}

          <label>Password:</label>
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <span onClick={togglePasswordVisibility} className="eye-icon">
              {showPassword ? '👁️' : '🙈'}
            </span>
          </div>
          {errors.password && <p className="error">{errors.password}</p>}

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <label>Role:</label>
          <select name="role" value={formData.role} onChange={handleInputChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <p>Already have an account? <Link to="/login">Login here</Link>.</p>
      </div>
    </div>
  );
}

export default Signup;
