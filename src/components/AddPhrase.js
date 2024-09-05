import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from './Auth/AuthContext';
import '../styles/addForm.css';

function AddPhrase() {
  const [phrase, setPhrase] = useState('');
  const [phraseMeaning, setPhraseMeaning] = useState('');
  const [phraseExample, setPhraseExample] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!user) {
      console.error('User is not logged in.');
      return;
    }

    const newPhrase = {
      phrase: phrase,
      phrase_meaning: phraseMeaning,
      phrase_example: phraseExample,
      created_by: user.id
    };

    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access')}`
      }
    };

    axios.post(`${process.env.REACT_APP_API_URL}/phrases/`, newPhrase, config)
      .then(response => {
        console.log('Phrase added successfully:', response.data);
        navigate('/', { state: { message: 'Fraza uspješno dodana, admin će je uskoro provjeriti.' } });
      })
      .catch(error => {
        console.error('Error adding phrase:', error.response ? error.response.data : error.message);
      });
  };

  return (
    <div className="add-phrase-container">
      <h1 className="add-phrase-title">Dodaj frazu</h1>
      <form onSubmit={handleSubmit} className="add-phrase-form">
        <label className="add-phrase-label">
          Fraza:
          <input type="text" value={phrase} onChange={e => setPhrase(e.target.value)} required className="add-phrase-input" />
        </label>
        <br />
        <label className="add-phrase-label">
          Značenje:
          <textarea value={phraseMeaning} onChange={e => setPhraseMeaning(e.target.value)} required className="add-phrase-textarea" />
        </label>
        <br />
        <label className="add-phrase-label">
          Primjer:
          <textarea value={phraseExample} onChange={e => setPhraseExample(e.target.value)} className="add-phrase-textarea" />
        </label>
        <br />
        <button type="submit" className="add-phrase-button">Dodaj frazu</button>
      </form>
    </div>
  );
}

export default AddPhrase;
