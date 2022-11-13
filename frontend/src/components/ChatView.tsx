import React from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import './ChatView.css';

function ChatView() {
  const location = useLocation()
  const { name } = location.state
  console.log(name)
  return (
    <div className="ChatView">
      <p>Name: {name || 'No name given'}</p>
      <Link to="/"><button>Go to Welcome View</button></Link>
    </div>
  );
}

export default ChatView