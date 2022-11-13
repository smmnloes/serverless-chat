import React, { SetStateAction, useState } from 'react';
import { CurrentView } from './ChatContainer';
import './WelcomeView.css'

function WelcomeView(props: { nextView: React.Dispatch<SetStateAction<CurrentView>> }) {
  return (
    <div>
      <p>Welcome</p>
      <button onClick={() => props.nextView(CurrentView.CHAT)}>ChangeView</button>
    </div>
  );
}

export default WelcomeView