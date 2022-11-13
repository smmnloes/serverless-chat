import React, { SetStateAction, useState } from 'react';
import { CurrentView } from './ChatContainer';
import './WelcomeView.css'

function ChatView(props: { nextView: React.Dispatch<SetStateAction<CurrentView>> }) {
  return (
    <div>
      <p>Chat</p>
      <button onClick={() => props.nextView(CurrentView.WELCOME)}>ChangeView</button>
    </div>
  );
}

export default ChatView