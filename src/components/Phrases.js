// src/components/Phrases.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from './Auth/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import '../styles/phrases.css';
import SortSelector from './SortSelector'; // Uvezite SortSelector komponentu

function Phrases() {
  const [phrases, setPhrases] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOption, setSortOption] = useState('date');
  const { isAuthenticated } = useContext(AuthContext);
  const [userLikes, setUserLikes] = useState(new Set());

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : "nepoznato";
  };

  useEffect(() => {
    const fetchPhrases = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/phrases/`, {
          params: {
            page: currentPage,
            sort: sortOption 
          }
        });
        setPhrases(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 10));
      } catch (error) {
        console.error('There was an error fetching the phrases!', error);
      }
    };

    fetchPhrases();
  }, [currentPage, sortOption]);

  useEffect(() => {
    if (isAuthenticated) {
      axios.get(`${process.env.REACT_APP_API_URL}/accounts/user/phrase-likes/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`
        }
      })
      .then(response => {
        const likedPhrases = response.data.phrase_likes || [];
        setUserLikes(new Set(likedPhrases));
      })
      .catch(error => {
        console.error('There was an error fetching user phrase likes!', error);
      });
    }
  }, [isAuthenticated]);

  const handleLike = async (phraseId) => {
    if (!isAuthenticated) {
      console.error('User must be logged in to like a phrase.');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/phrases/${phraseId}/like/`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`
        }
      });

      setUserLikes(prevLikes => {
        const updatedLikes = new Set(prevLikes);
        if (response.data.status === 'Liked') {
          updatedLikes.add(phraseId);
        } else {
          updatedLikes.delete(phraseId);
        }
        return updatedLikes;
      });

      setPhrases(prevPhrases =>
        prevPhrases.map(phrase =>
          phrase.id === phraseId
            ? { ...phrase, liked: response.data.status === 'Liked', like_count: response.data.like_count }
            : phrase
        )
      );
    } catch (error) {
      console.error('There was an error liking the phrase!', error);
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
    <div className="phrases-container">
      <h1>Phrases</h1>
      {isAuthenticated && (
        <Link to="/add-phrase" className="add-phrase-link">Add Phrase</Link>
      )}
      <SortSelector onSortChange={handleSortChange} /> {/* Dodajte SortSelector */}

      <ul className="phrases-list">
        {phrases.map(phrase => (
          <li key={phrase.id} className="phrases-item-box">
            <Link to={`/phrases/${phrase.id}`} className="phrases-item-link">
              <div className="phrases-item-title">{phrase.phrase}</div>
              <div className="phrases-item-meaning"> {phrase.phrase_meaning}</div>
              <div className="phrases-item-example"> {phrase.phrase_example}</div>
            </Link>
            <div className="phrases-item-footer">
              <div className="phrases-item-created-by">
                Created by: {phrase.created_by}
              </div>
              <div className="phrases-item-likes-count">
                Likes: {phrase.like_count}
              </div>
              <div className="item-created-at"><strong>Created at:</strong> {formatDate(phrase.created_at)}</div>

              {isAuthenticated && (
                <div className="like-icon-container" onClick={() => handleLike(phrase.id)}>
                  <FontAwesomeIcon 
                    icon={userLikes.has(phrase.id) ? faThumbsDown : faThumbsUp} 
                    className={`like-icon ${userLikes.has(phrase.id) ? 'liked' : ''}`} 
            
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

export default Phrases;
