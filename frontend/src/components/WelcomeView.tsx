import React, { SetStateAction, useState } from 'react';
import { Route, Routes } from 'react-router';
import { BrowserRouter, Link } from 'react-router-dom';
import ChatView from './ChatView';
import './WelcomeView.css'

function WelcomeView() {
  const [name, newName] = useState("")
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {newName(event.target.value); console.log(name)}

  return (
    <div className='WelcomeView'>
      <h1>Welcome to Serverless Chat!</h1>
      <div className="inputContainer">
        <label htmlFor="nameInput">Please enter your name</label>
        <input id="nameInput" type="string" onChange={handleInput}></input>
        <Link to="/chat" state={{name}}><button>Connect</button></Link>
      </div>
    </div>
  );
}

export default WelcomeView