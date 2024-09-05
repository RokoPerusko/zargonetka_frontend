import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/wordDetail.css'; // Import CSS for styling

function WordDetail() {
  const { id } = useParams();
  const [word, setWord] = useState(null);

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : "nepoznato";
  };

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/words/${id}/`)
      .then(response => {
        setWord(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the word details!', error);
      });
  }, [id]);

  if (!word) return <p>Loading...</p>;

  return (
    <div className="word-detail-container">
      <h1>{word.word}</h1>
      <p><strong>Meaning:</strong> {word.word_meaning}</p>
      <p><strong>Example:</strong> {word.word_example}</p>
      <p><strong>Likes:</strong> {word.like_count}</p>
      <p><strong>Created By:</strong> {word.created_by}</p> {/* Assuming created_by is available */}
      <p><strong>Created at:</strong> {formatDate(word.created_at)}</p> {/* Formatiranje datuma */}

    </div>
  );
}

export default WordDetail;
