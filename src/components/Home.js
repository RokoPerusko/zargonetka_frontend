import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import '../styles/home.css'; // Import CSS for styling the Home component

function Home() {
  const [topWords, setTopWords] = useState([]);
  const [topPhrases, setTopPhrases] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const location = useLocation();
  const message = location.state?.message;

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : "nepoznato";
  };

  useEffect(() => {
    // Fetch top 10 words
    axios.get(`${process.env.REACT_APP_API_URL}/words/top10/`)
      .then(response => {
        setTopWords(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the top words!', error);
      });

    // Fetch top 10 phrases
    axios.get(`${process.env.REACT_APP_API_URL}/phrases/top10/`)
      .then(response => {
        setTopPhrases(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the top phrases!', error);
      });
  }, []);

  useEffect(() => {
    if (message) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 5000); // Hide message after 5 seconds

      return () => clearTimeout(timer); // Clean up the timer
    }
  }, [message]);

  return (
    <div className="home-container">
      {showMessage && <div className="popup-message">{message}</div>}
      <h1 className="main-title">Welcome to the Language Learning App</h1>

      <div className="sub-container">
        <div className="sub-title">Top 10 Words</div>
        <div className="sub-title">Top 10 Phrases</div>
      </div>

      <div className="sub-container">
        <div className="item-list">
          {topWords.length > 0 ? (
            topWords.map(word => (
              <div className="item-box" key={word.id}>
                <h3 className="item-title">
                  <Link to={`/words/${word.id}`}>{word.word}</Link> {/* Link to word detail */}
                </h3>
                <p className="item-meaning">{word.word_meaning}</p>
                <p className="item-example">{word.word_example}</p>
                <p className="item-likes">Likes: {word.like_count}</p>
                <p className="item-creator">Created by: {word.created_by}</p>
                <div className="item-created-at"><strong>Created at:</strong> {formatDate(word.created_at)}</div> {/* Formatiranje datuma */}

              </div>
            ))
          ) : (
            <p>No words available yet.</p>
          )}
        </div>

        <div className="item-list">
          {topPhrases.length > 0 ? (
            topPhrases.map(phrase => (
              <div className="item-box" key={phrase.id}>
                <h3 className="item-title">
                  <Link to={`/phrases/${phrase.id}`}>{phrase.phrase}</Link> {/* Link to phrase detail */}
                </h3>
                <p className="item-meaning"><strong>Meaning:</strong> {phrase.phrase_meaning}</p>
                <p className="item-example"><strong>Example:</strong> {phrase.phrase_example}</p>
                <p className="item-likes">Likes: {phrase.like_count}</p>
                <p className="item-creator">Created by: {phrase.created_by}</p>
                <div className="item-created-at"><strong>Created at:</strong> {formatDate(phrase.created_at)}</div> {/* Formatiranje datuma */}

              </div>
            ))
          ) : (
            <p>No phrases available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
