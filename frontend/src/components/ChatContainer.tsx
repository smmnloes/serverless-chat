import React from 'react';

function ChatContainer(props: {message: string}) {
    return (
      <div className="ChatContainer">
        <p>This is the container. Message: {props.message}</p>
      </div>
    );
  }

export default ChatContainer