import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { SearchContext } from '../../context/SearchContext';
import { Link } from 'react-router-dom';
import '../../styles/searchResults.css';
import SortSelector from '../SortSelector';

function SearchResults() {
  const { searchQuery } = useContext(SearchContext);
  const [results, setResults] = useState([]);
  const [sort, setSort] = useState('date'); // Defaultno sortiranje po datumu

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : "nepoznato";
  };

  const handleSortChange = (sortOption) => {
    setSort(sortOption);
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (searchQuery.trim()) {
        try {
          // Napravite paralelne API pozive za riječi i fraze, koristeći isti pristup podacima
          const [wordsResponse, phrasesResponse] = await Promise.all([
            axios.get(`${process.env.REACT_APP_API_URL}/words/search/`, {
              params: { search: searchQuery, sort } // Sortiranje na osnovu parametra
            }),
            axios.get(`${process.env.REACT_APP_API_URL}/phrases/search/`, {
              params: { search: searchQuery, sort } // Sortiranje na osnovu parametra
            })
          ]);

          // Kombinovanje rezultata iz oba API poziva
          const combinedResults = [
            ...wordsResponse.data.map(word => ({ ...word, type: 'word' })),
            ...phrasesResponse.data.map(phrase => ({ ...phrase, type: 'phrase' }))
          ];

          setResults(combinedResults);
        } catch (error) {
          console.error('There was an error fetching search results!', error);
        }
      } else {
        setResults([]);
      }
    };

    fetchResults();
  }, [searchQuery, sort]);

  return (
    <div className="search-results">
      <h1>Search Results for "{searchQuery}"</h1>
      <SortSelector onSortChange={handleSortChange} />
      <div className="search-results-section">
        <ul>
          {results.length > 0 ? (
            results.map(result => (
              <li key={result.id} className="item-box">
                <Link to={`/${result.type === 'word' ? 'words' : 'phrases'}/${result.id}`} className="item-title">
                  {result.type === 'word' ? result.word : result.phrase}
                </Link>
                <div className="item-meaning">
                  {result.type === 'word' ? result.word_meaning : result.phrase_meaning}
                </div>
                <div className="item-example">
                  {result.type === 'word' ? result.word_example : result.phrase_example}
                </div>
                <div className="item-created-by">
                  <strong>Created by:</strong> {result.created_by} <span className="item-type">({result.type})</span>
                </div>
                <div className="item-created-at"><strong>Created at:</strong> {formatDate(result.created_at)}</div>
              </li>
            ))
          ) : (
            <li>No results found.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default SearchResults;
