import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/Global.css';
import { UserProvider } from './contexts/UserContext';
import { AuthProvider } from './contexts/AuthContext';
import { SignalRProvider } from './contexts/SignalRContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <AuthProvider>
    <UserProvider>
      <SignalRProvider>
        <App />
      </SignalRProvider>
    </UserProvider>
  </AuthProvider>
);
