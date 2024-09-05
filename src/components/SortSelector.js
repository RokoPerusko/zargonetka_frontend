// src/components/SortSelector.js
import React from 'react';
import '../styles/sortSelect.css'

const SortSelector = ({ onSortChange }) => {
  const handleChange = (event) => {
    onSortChange(event.target.value);
  };

  return (
    <div className="sort-selector">
      <label htmlFor="sort">Sortiraj po:</label>
      <select id="sort" onChange={handleChange} defaultValue="date"> {/* Dodajte defaultValue */}
        <option value="date">Datum izrade</option>
        <option value="likes">Broj lajkova</option>
        <option value="alphabetical">Abecedno</option>
      </select>
    </div>
  );
};

export default SortSelector;
