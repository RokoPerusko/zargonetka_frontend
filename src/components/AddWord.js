import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import AuthContext from './Auth/AuthContext';
import '../styles/addForm.css'; // Novi CSS fajl za stilizovanje ove komponente

function AddWord() {
  const [word, setWord] = useState('');
  const [wordMeaning, setWordMeaning] = useState('');
  const [wordExample, setWordExample] = useState('');
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      console.error('User is not logged in.');
      return;
    }

    const newWord = {
      word: word,
      word_meaning: wordMeaning,
      word_example: wordExample
    };

    axios.post(`${process.env.REACT_APP_API_URL}/words/`, newWord, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access')}`
      }
    })
      .then(response => {
        console.log('Word added successfully:', response.data);
        navigate('/', { state: { message: 'Riječ uspješno dodana, admin će je uskoro provjeriti.' } });
      })
      .catch(error => {
        console.error('Error adding word:', error);
      });
  };

  return (
    <div className="add-word-container">
      <h1 className="add-word-title">Dodaj riječ</h1>
      <form onSubmit={handleSubmit} className="add-word-form">
        <label className="add-word-label">
          Riječ:
          <input type="text" value={word} onChange={e => setWord(e.target.value)} required className="add-word-input" />
        </label>
        <br />
        <label className="add-word-label">
          Značenje:
          <textarea value={wordMeaning} onChange={e => setWordMeaning(e.target.value)} required className="add-word-textarea" />
        </label>
        <br />
        <label className="add-word-label">
          Primjer:
          <textarea value={wordExample} onChange={e => setWordExample(e.target.value)} className="add-word-textarea" />
        </label>
        <br />
        <button type="submit" className="add-word-button">Dodaj riječ</button>
      </form>
    </div>
  );
}

export default AddWord;
