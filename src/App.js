import React from 'react';
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';

import authService from './services/authService';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import PlayPage from './pages/PlayPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AboutPage from './pages/AboutPage';
import GamePage from './pages/GamePage';
import { useUser } from './contexts/UserContext';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user, setUser } = useUser();
  const { isAuth, setIsAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authService
      .getUser()
      .then(response => {
        setUser(response.data);
        setIsAuth(true);
      })
      .catch(() => {
        setIsAuth(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const isUserInGame = () =>
    user.gameId !== '00000000-0000-0000-0000-000000000000';

  return isLoading ? (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Spinner animation="border" />
    </div>
  ) : (
    <BrowserRouter>
      <NavBar />
      {isAuth ? (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/play"
            element={isUserInGame() ? <Navigate to="/game" /> : <PlayPage />}
          />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/game"
            element={isUserInGame() ? <GamePage /> : <Navigate to="/play" />}
          />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/play" element={<Navigate to="/login" />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
