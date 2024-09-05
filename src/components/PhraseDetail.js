import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/phraseDetail.css'; // Import CSS for styling

const formatDate = (date) => {
  return date ? new Date(date).toLocaleDateString() : "nepoznato";
};

function PhraseDetail() {
  const { id } = useParams();
  const [phrase, setPhrase] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/phrases/${id}/`)
      .then(response => {
        setPhrase(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the phrase details!', error);
      });
  }, [id]);

  if (!phrase) return <p>Loading...</p>;

  return (
    <div className="phrase-detail-container">
      <h1>{phrase.phrase}</h1>
      <p><strong>Meaning:</strong> {phrase.phrase_meaning}</p>
      <p><strong>Example:</strong> {phrase.phrase_example}</p>
      <p><strong>Likes:</strong> {phrase.like_count}</p>
      <p><strong>Created By:</strong> {phrase.created_by}</p> {/* Assuming created_by is available */}
      <p><strong>Created at:</strong> {formatDate(phrase.created_at)}</p> {/* Formatiranje datuma */}

    </div>
  );
}

export default PhraseDetail;
