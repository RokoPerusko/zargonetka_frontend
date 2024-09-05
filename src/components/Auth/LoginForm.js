import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext'; // Import AuthContext
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../../styles/login.css'; // Import CSS styles

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext); // Use login from AuthContext
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/token/`, {
        username,
        password
      });
      login(response.data.access); // Pass the token to the login function
      navigate('/'); // Redirect to the home page after successful login
    } catch (error) {
      console.error('Error logging in:', error);
      // Handle login error
    }
  };

  return (
    <form onSubmit={handleLogin} className="login-form">
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
      {/* Error messages can be added here if necessary */}
    </form>
  );
}

export default LoginForm;
