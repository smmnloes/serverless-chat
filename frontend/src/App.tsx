import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import ChatView from './components/ChatView';
import WelcomeView from './components/WelcomeView';

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomeView />} />
      <Route path="/chat" element={<ChatView />} />
    </Routes>
  );
}

export default App;
