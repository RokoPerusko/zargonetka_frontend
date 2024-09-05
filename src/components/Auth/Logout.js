// src/components/Auth/LogoutButton.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';  // Import your authentication context
import '../../styles/logout.css'; // Import the new CSS file

function LogoutButton() {
  const { logout } = useContext(AuthContext); // Assuming you have a logout function in context
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = () => {
    logout(); // Perform the logout logic (e.g., clear token from localStorage)
    navigate('/'); // Redirect to home page after logout
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
}

export default LogoutButton;
