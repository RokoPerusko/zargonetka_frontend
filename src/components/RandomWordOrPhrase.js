import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Uvoz Link komponente
import '../styles/random.css';  // Uvoz stilova

function RandomWordOrPhrase() {
  const [randomItem, setRandomItem] = useState(null);
  const [error, setError] = useState(null);
  const [isPhrase, setIsPhrase] = useState(true); // Pretpostavimo da je zadano na fraze


  const fetchRandomItem = async () => {
    setError(null); // Resetiranje grešaka

    try {
      const endpoint = isPhrase ? '/phrases/random/' : '/words/random/';
      const response = await axios.get(`${process.env.REACT_APP_API_URL}${endpoint}`);
      setRandomItem(response.data);
    } catch (err) {
      console.error('Error fetching random item:', err);
      setError('Error fetching random item.');
    }
  };

  const handleSwitch = () => {
    // Prebacivanje između riječi i fraza i resetiranje prikaza
    setIsPhrase((prevIsPhrase) => !prevIsPhrase);
    setRandomItem(null); // Resetiranje randomItem kako bi se očistio ekran
  };

  return (
    <div className="random-container">
      <h1 className="random-title">Random {isPhrase ? 'Phrase' : 'Word'}</h1>
      <div className="random-buttons">
        <button className="random-button" onClick={fetchRandomItem}>
          Get Random {isPhrase ? 'Phrase' : 'Word'}
        </button>
        <button className="random-button" onClick={handleSwitch}>
          Switch to {isPhrase ? 'Words' : 'Phrases'}
        </button>
      </div>
      {randomItem && (
        <div className="random-item">
          {isPhrase ? (
            <div>
              <h2>{randomItem.phrase}</h2>
              <p><strong>Meaning:</strong> {randomItem.phrase_meaning}</p>
              <p><strong>Example:</strong> {randomItem.phrase_example}</p>
              <Link to={`/phrases/${randomItem.id}`} className="random-item-link">
                View Details
              </Link>
            </div>
          ) : (
            <div>
              <strong>{randomItem.word}</strong>: {randomItem.word_meaning} - <em>{randomItem.word_example}</em>
              <Link to={`/words/${randomItem.id}`} className="random-item-link">
                View Details
              </Link>
            </div>
          )}
        </div>
      )}
      {error && <div className="random-error">{error}</div>}
    </div>
  );
}

export default RandomWordOrPhrase;
