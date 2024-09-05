import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchContext } from '../../context/SearchContext'; // Provjerite putanju
import '../../styles/searchBar.css';

function SearchBar() {
  const { setSearchQuery } = useContext(SearchContext);
  const [query, setQuery] = useState('');
  const navigate = useNavigate(); // Dodano za navigaciju

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(query);
    navigate('/search'); // Dodano za preusmjeravanje na SearchResults
    setQuery(''); // Očistite input nakon slanja
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input 
        type="text" 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="Search for words or phrases..." 
      />
      <button type="submit" className="search-button">
        {/* SVG for magnifying glass icon */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          className="search-icon"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M21 21l-4.35-4.35M16.65 9a7.65 7.65 0 1 1-15.3 0 7.65 7.65 0 0 1 15.3 0z" 
          />
        </svg>
      </button>
    </form>
  );
}

export default SearchBar;
