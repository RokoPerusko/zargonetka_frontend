import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Navigate, Link } from 'react-router-dom'; // Uvoz Link komponente
import AuthContext from './Auth/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import '../styles/profile.css';

function Profile() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [createdWords, setCreatedWords] = useState([]);
  const [createdPhrases, setCreatedPhrases] = useState([]);
  const [likedWords, setLikedWords] = useState([]);
  const [likedPhrases, setLikedPhrases] = useState([]);

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : "nepoznato";
  };

  // Funkcija za dohvaćanje svih podataka s paginacijom
  const fetchAllPaginatedData = async (url, token) => {
    let results = [];
    let nextPage = url;

    while (nextPage) {
      try {
        const response = await axios.get(nextPage, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        results = [...results, ...response.data.results];
        nextPage = response.data.next;
      } catch (error) {
        console.error('There was an error fetching paginated data!', error);
        break;
      }
    }

    return results;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) {
        return;
      }

      try {
        const token = localStorage.getItem('access');

        // Fetch all created words
        const createdWords = await fetchAllPaginatedData(`${process.env.REACT_APP_API_URL}/accounts/user/created-words/`, token);
        setCreatedWords(createdWords);

        // Fetch all created phrases
        const createdPhrases = await fetchAllPaginatedData(`${process.env.REACT_APP_API_URL}/accounts/user/created-phrases/`, token);
        setCreatedPhrases(createdPhrases);

        // Fetch liked words
        const likedWordsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/accounts/user/word-likes/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const likedWordIds = likedWordsResponse.data.likes;

        // Fetch all words and filter for liked ones
        const allWords = await fetchAllPaginatedData(`${process.env.REACT_APP_API_URL}/words/`, token);
        const likedWords = allWords.filter(word => likedWordIds.includes(word.id));
        setLikedWords(likedWords);

        // Fetch liked phrases
        const likedPhrasesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/accounts/user/phrase-likes/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const likedPhraseIds = likedPhrasesResponse.data.phrase_likes;

        // Fetch all phrases and filter for liked ones
        const allPhrases = await fetchAllPaginatedData(`${process.env.REACT_APP_API_URL}/phrases/`, token);
        const likedPhrases = allPhrases.filter(phrase => likedPhraseIds.includes(phrase.id));
        setLikedPhrases(likedPhrases);

      } catch (error) {
        console.error('There was an error fetching data!', error);
        if (error.response?.status === 401) {
          logout();
        }
      }
    };

    fetchData();
  }, [isAuthenticated, logout]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="profile-container">
      <h1>Your Profile</h1>

      <div className="sections-row">
        <div className="section">
          <h2>Created Words</h2>
          <ul>
            {createdWords.length > 0 ? (
              createdWords.map(word => (
                <li key={word.id} className="item-box">
                  <Link to={`/words/${word.id}`} className="item-title">
                    {word.word}
                  </Link>
                  <div className="item-meaning">{word.word_meaning}</div>
                  <div className="item-example">{word.word_example}</div>
                  <div className="item-created-at"><strong>Created at:</strong> {formatDate(word.created_at)}</div>
                </li>
              ))
            ) : (
              <li>No created words found.</li>
            )}
          </ul>
        </div>

        <div className="section">
          <h2>Created Phrases</h2>
          <ul>
            {createdPhrases.length > 0 ? (
              createdPhrases.map(phrase => (
                <li key={phrase.id} className="item-box">
                  <Link to={`/phrases/${phrase.id}`} className="item-title">
                    {phrase.phrase}
                  </Link>
                  <div className="item-meaning">{phrase.phrase_meaning}</div>
                  <div className="item-example">{phrase.phrase_example}</div>
                  <div className="item-created-at"><strong>Created at:</strong> {formatDate(phrase.created_at)}</div>
                </li>
              ))
            ) : (
              <li>No created phrases found.</li>
            )}
          </ul>
        </div>

        <div className="section">
          <h2>Liked Words</h2>
          <ul>
            {likedWords.length > 0 ? (
              likedWords.map(word => (
                <li key={word.id} className="item-box">
                  <Link to={`/words/${word.id}`} className="item-title">
                    {word.word}
                  </Link>
                  <div className="item-meaning">{word.word_meaning}</div>
                  <div className="item-example">{word.word_example}</div>
                  <div className="item-created-at"><strong>Created at:</strong> {formatDate(word.created_at)}</div>
                  <FontAwesomeIcon
                    icon={faThumbsUp}
                    className="like-icon liked"
                    style={{ color: 'blue' }}
                  />
                </li>
              ))
            ) : (
              <li>No liked words found.</li>
            )}
          </ul>
        </div>

        <div className="section">
          <h2>Liked Phrases</h2>
          <ul>
            {likedPhrases.length > 0 ? (
              likedPhrases.map(phrase => (
                <li key={phrase.id} className="item-box">
                  <Link to={`/phrases/${phrase.id}`} className="item-title">
                    {phrase.phrase}
                  </Link>
                  <div className="item-meaning">{phrase.phrase_meaning}</div>
                  <div className="item-example">{phrase.phrase_example}</div>
                  <div className="item-created-at"><strong>Created at:</strong> {formatDate(phrase.created_at)}</div>
                  <FontAwesomeIcon
                    icon={faThumbsUp}
                    className="like-icon liked"
                    style={{ color: 'blue' }}
                  />
                </li>
              ))
            ) : (
              <li>No liked phrases found.</li>
            )}
          </ul>
        </div>
      </div>
    </div>

  );
}

export default Profile;
