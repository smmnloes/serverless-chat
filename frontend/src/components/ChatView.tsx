import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { Listeners, webSocketService } from '../services/websocket-service';
import './ChatView.css';

function ChatView() {
  const location = useLocation()
  const { name } = location.state
  const [connectionStatus, setConnectionStatus] = useState(ConnectionStatus.DISCONNECTED)
  const [websocketConnection, setWebsocketConnection] = useState({})

  const listeners: Listeners = {
    onMessage: (data) => {
      if (data.type === 'utf8') {
        console.log(data.utf8Data)
      }
    },
    onError: (error) => console.error(JSON.stringify(error)),
    onClose: (code, desc) => console.log('Connection closed with code ' + code)
  }

  // Init websocket connection
  useEffect(() => {
    (async function () {
      setConnectionStatus(ConnectionStatus.CONNECTING)
      setWebsocketConnection(await webSocketService('wss://chat-ws-api.mloesch.it/?name=' + name, listeners))
      setConnectionStatus(ConnectionStatus.CONNECTED)
    })();
  }, [])


  console.log(name)
  return (
    <div className="ChatView">
      <p>Name: {name || 'No name given'}</p>
      <p>Connection status: {connectionStatus}</p>
      <Link to="/"><button>Go to Welcome View</button></Link>
    </div>
  );
}

export default ChatView

enum ConnectionStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting...'
}