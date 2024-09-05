import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import '../styles/trivia.css';

function TriviaGame() {
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [result, setResult] = useState(null);
  const [isPhrase, setIsPhrase] = useState(true);

  // Refs for buttons
  const buttonsRef = useRef([]);

  // Function to shuffle array
  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const fetchTriviaQuestion = useCallback(async () => {
    try {
      const endpoint = isPhrase ? '/phrases/trivia/' : '/words/trivia/';
      const response = await axios.get(`${process.env.REACT_APP_API_URL}${endpoint}`);
      
      const fetchedQuestion = response.data;

      // Check if `answers` exists
      if (!fetchedQuestion.answers) {
        console.error('No answers found in the response:', fetchedQuestion);
        setQuestion(null);
        return;
      }

      // Shuffle answers
      const shuffledAnswers = shuffleArray(fetchedQuestion.answers);

      // Set new question with shuffled answers
      setQuestion({
        ...fetchedQuestion,
        answers: shuffledAnswers,
      });

      // Reset state
      setSelectedAnswer(null);
      setResult(null);
    } catch (error) {
      console.error('Error fetching trivia question:', error);
    }
  }, [isPhrase]);

  useEffect(() => {
    fetchTriviaQuestion();
  }, [fetchTriviaQuestion]);

  useEffect(() => {
    // Adjust button heights after rendering
    if (buttonsRef.current.length) {
      const heights = buttonsRef.current.map(button => button ? button.clientHeight : 0);
      const maxHeight = Math.max(...heights);
      buttonsRef.current.forEach(button => {
        if (button) button.style.height = `${maxHeight}px`;
      });
    }
  }, [question]);

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
    const isCorrect = answer.is_correct;
    setResult(isCorrect);
  };

  const handleRepeatQuestion = () => {
    setSelectedAnswer(null);
    setResult(null);
  };

  const handleSwitchTrivia = () => {
    setIsPhrase(prevState => !prevState);
    setQuestion(null);
    setSelectedAnswer(null);
    setResult(null);
  };

  return (
    <div className="trivia-container">
      <h1 className="trivia-title">{isPhrase ? 'Phrase' : 'Word'} Trivia</h1>
      <button className="trivia-switch" onClick={handleSwitchTrivia}>
        Switch to {isPhrase ? 'Word' : 'Phrase'} Trivia
      </button>
      {question ? (
        <div className="trivia-question-container">
          <h2 className="trivia-question">{isPhrase ? question.phrase : question.word}</h2>
          <div className="trivia-buttons">
            {question.answers.map((answer, index) => (
              <button
                key={index}
                ref={el => buttonsRef.current[index] = el}
                className={`trivia-button ${selectedAnswer ? (answer.is_correct ? 'correct' : 'incorrect') : ''}`}
                onClick={() => handleAnswerClick(answer)}
                disabled={selectedAnswer !== null}
              >
                {answer.text}
              </button>
            ))}
          </div>
          {selectedAnswer && (
            <div className="trivia-result">
              {result ? <p>Correct!</p> : <p>Incorrect!</p>}
              <button className="trivia-button-next" onClick={fetchTriviaQuestion}>Next Question</button>
              <button className="trivia-button-repeat" onClick={handleRepeatQuestion}>Repeat Question</button>
            </div>
          )}
        </div>
      ) : (
        <p>Loading question...</p>
      )}
    </div>
  );
}

export default TriviaGame;
