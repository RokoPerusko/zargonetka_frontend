import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../../styles/register.css'; // Import CSS styles with correct relative path

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState(null); // State to store any errors

  const navigate = useNavigate(); // Initialize useNavigate

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null); // Reset any previous errors

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/accounts/register/`,
        { username, password1, password2 }
      );
      // Handle successful registration
      console.log('Registration successful:', response.data);
      navigate('/login'); // Redirect to login page
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error('Server error:', error.response.data);
        setError(error.response.data); // Set the error response to display on the form
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response from server:', error.request);
        setError('No response from server. Please try again later.');
      } else {
        // Something else happened in setting up the request
        console.error('Error setting up request:', error.message);
        setError(error.message);
      }
    }
  };

  return (
    <form onSubmit={handleRegister} className="register-form">
      <h1>Register</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password1}
        onChange={(e) => setPassword1(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={password2}
        onChange={(e) => setPassword2(e.target.value)}
      />
      <button type="submit">Register</button>
      {error && (
        <div className="error">
          {/* Display error messages from the server */}
          {typeof error === 'string' ? error : JSON.stringify(error)}
        </div>
      )}
    </form>
  );
}

export default RegisterForm;
