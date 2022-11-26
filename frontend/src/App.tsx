import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import ChatView from './components/ChatView';
import WelcomeView from './components/WelcomeView';
import ScrollTop from './features/scrollTop';

function App() {
  return (
    <ScrollTop>
      <Routes>
        <Route path="/" element={<WelcomeView />} />
        <Route path="/chat" element={<ChatView />} />
      </Routes>
    </ScrollTop>
  );
}

export default App;
