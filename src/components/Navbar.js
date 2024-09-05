import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from './Auth/AuthContext';  // Import the context
import LogoutButton from './Auth/Logout'; // Import the LogoutButton component
import '../styles/navbar.css'; // Import custom CSS file for navbar
import SearchBar from './search/SearchBar';

function Navbar() {
  const { isAuthenticated } = useContext(AuthContext); // Check if the user is authenticated
  const [isOpen, setIsOpen] = useState(false); // State to handle the hamburger menu toggle

  const handleToggle = () => {
    setIsOpen(!isOpen); // Toggle the menu open/close
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link className="navbar-brand" to="/">Zargonetka</Link>
        
        <button className="navbar-toggler" onClick={handleToggle}>
          ☰ {/* Hamburger menu icon */}
        </button>

        {/* Menu items including the SearchBar */}
        <ul className={`navbar-nav ${isOpen ? 'open' : ''}`}>
          {/* SearchBar moved inside the menu items for mobile */}
          <li className="nav-item search-item">
            <SearchBar />
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/" onClick={() => setIsOpen(false)}>Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/words" onClick={() => setIsOpen(false)}>Words</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/phrases" onClick={() => setIsOpen(false)}>Phrases</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/trivia" onClick={() => setIsOpen(false)}>Trivia Game</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/random" onClick={() => setIsOpen(false)}>Random Word or Phrase</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/profile" onClick={() => setIsOpen(false)}>Profile</Link>
          </li>
          {!isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login" onClick={() => setIsOpen(false)}>Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register" onClick={() => setIsOpen(false)}>Register</Link>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <LogoutButton onClick={() => setIsOpen(false)} /> {/* Show logout button if authenticated */}
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
