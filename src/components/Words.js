// src/components/Words.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from './Auth/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import '../styles/words.css';
import SortSelector from './SortSelector'; // Uvezite SortSelector komponentu

const formatDate = (date) => {
  return date ? new Date(date).toLocaleDateString() : "nepoznato";
};

function Words() {
  const [words, setWords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOption, setSortOption] = useState('date'); // Dodajte stanje za sortiranje
  const { isAuthenticated } = useContext(AuthContext);
  const [userLikes, setUserLikes] = useState(new Set());

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/words/`, {
          params: {
            page: currentPage,
            sort: sortOption // Proslijedite opciju sortiranja
          }
        });
        setWords(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 10));
      } catch (error) {
        console.error('There was an error fetching the words!', error);
      }
    };

    fetchWords();
  }, [currentPage, sortOption]);

  useEffect(() => {
    if (isAuthenticated) {
      axios.get(`${process.env.REACT_APP_API_URL}/accounts/user/word-likes/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`
        }
      })
      .then(response => {
        setUserLikes(new Set(response.data.likes));
      })
      .catch(error => {
        console.error('There was an error fetching user likes!', error);
      });
    }
  }, [isAuthenticated]);

  const handleLike = async (wordId) => {
    if (!isAuthenticated) {
      console.error('User must be logged in to like a word.');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/words/${wordId}/like/`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`
        }
      });

      setWords(words.map(word => 
        word.id === wordId ? { 
          ...word, 
          liked: response.data.status === 'Liked',
          like_count: response.data.like_count
        } : word
      ));

      setUserLikes(prevLikes => {
        const updatedLikes = new Set(prevLikes);
        if (response.data.status === 'Liked') {
          updatedLikes.add(wordId);
        } else {
          updatedLikes.delete(wordId);
        }
        return updatedLikes;
      });
    } catch (error) {
      console.error('There was an error liking the word!', error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSortChange = (sortOption) => {
    setSortOption(sortOption);
    setCurrentPage(1); // Resetirajte stranicu na 1 kad se sortira
  };

  return (
    <div className="words-container">
      <h1>Words</h1>
      {isAuthenticated && (
        <Link to="/add-word" className="add-word-link">Add Word</Link>
      )}
      <SortSelector onSortChange={handleSortChange} /> {/* Dodajte SortSelector */}

      <ul className="words-list">
        {words.map(word => (
          <li key={word.id} className="words-item-box">
            <Link to={`/words/${word.id}`} className="words-item-link">
              <div className="words-item-title">{word.word}</div>
              <div className="words-item-meaning">{word.word_meaning}</div>
              <div className="words-item-example">{word.word_example}</div>
            </Link>
            <div className="words-item-footer">
              <div className="words-item-created-by">
                Created by: {word.created_by}
              </div>
              <div className="words-item-likes-count">
                Likes: {word.like_count}
              </div>
              <div className="item-created-at"><strong>Created at:</strong> {formatDate(word.created_at)}</div>

              {isAuthenticated && (
                <div className="like-icon-container" onClick={() => handleLike(word.id)}>
                  <FontAwesomeIcon 
                    icon={userLikes.has(word.id) ? faThumbsDown : faThumbsUp} 
                    className={`like-icon ${userLikes.has(word.id) ? 'liked' : ''}`} 
                    style={{ cursor: 'pointer' }} 
                  />
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="pagination-controls">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            disabled={index + 1 === currentPage}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Words;
