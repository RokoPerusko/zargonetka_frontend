import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Words from './components/Words';
import Phrases from './components/Phrases';
import AddWord from './components/AddWord';
import AddPhrase from './components/AddPhrase';
import LoginForm from './components/Auth/LoginForm';
import Profile from './components/Profile';
import RegisterForm from './components/Auth/RegisterForm';
import TriviaGame from './components/TriviaGame';
import RandomWordOrPhrase from './components/RandomWordOrPhrase';
import { AuthProvider } from './components/Auth/AuthContext';
import WordDetail from './components/WordDetail';
import PhraseDetail from './components/PhraseDetail';
import SearchResults from './components/search/SearchResults';
import { SearchProvider } from './context/SearchContext'; // Provjerite putanju

function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <Router>
          <div>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/words" element={<Words />} />
              <Route path="/phrases" element={<Phrases />} />
              <Route path="/add-word" element={<AddWord />} />
              <Route path="/add-phrase" element={<AddPhrase />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/trivia" element={<TriviaGame />} />
              <Route path="/random" element={<RandomWordOrPhrase />} />
              <Route path="/words/:id" element={<WordDetail />} />
              <Route path="/phrases/:id" element={<PhraseDetail />} />
              <Route path="/search" element={<SearchResults />} />
            </Routes>
          </div>
        </Router>
      </SearchProvider>
    </AuthProvider>
  );
}

export default App;
