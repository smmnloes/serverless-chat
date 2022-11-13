import React, { useState } from 'react';
import './ChatContainer.css'
import ChatView from './ChatView';
import WelcomeView from './WelcomeView';

function ChatContainer() {
  const [currentView, nextView] = useState(CurrentView.WELCOME)
  if (currentView === CurrentView.WELCOME) {
    return (
      <WelcomeView nextView={nextView} />
    )
  } else if (currentView === CurrentView.CHAT) {
    return (
      <ChatView nextView={nextView} />
    )
  } else {
    return (
      <WelcomeView nextView={nextView} />
    )
  }
}





export default ChatContainer

export enum CurrentView {
  WELCOME = 'Welcome',
  CHAT = 'Chat'
}