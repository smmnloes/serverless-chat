import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router';
import {Link} from 'react-router-dom';
import './ChatView.css';
import {RecieveMessageProps, SendMessageContainer} from "../../../common/websocket-types/chat-message";
import {messageTransformer} from "../services/messageTransformer";
import useWebSocket, {ReadyState} from "react-use-websocket";

export enum ConnectionStatus {
    CONNECTED = 'connected', DISCONNECTED = 'disconnected', CONNECTING = 'connecting...'
}


function ChatView() {
    const location = useLocation()
    const {name} = location.state
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState<RecieveMessageProps[]>([])

    function messageChangeHandler(e: React.FormEvent<HTMLInputElement>) {
        setMessage(e.currentTarget.value)
    }

    const url = 'wss://chat-ws-api.mloesch.it'

    const {sendMessage, lastMessage, readyState} = useWebSocket(url, {
        queryParams: {name},
        onError: (error) => console.log(error),
        shouldReconnect: () => true,
        retryOnError: true,
        reconnectAttempts: 5,
        reconnectInterval: 3000
    });
    useEffect(() => {
        if (lastMessage !== null) {
            setMessages((prev) => prev.concat(JSON.parse(lastMessage.data)));
        }
    }, [lastMessage, setMessages]);


    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    useEffect(() => {
        // scroll down in div
        const messgeViewDiv = document.getElementById('MessageView');
        if (messgeViewDiv) {
            messgeViewDiv.scrollTop = messgeViewDiv.scrollHeight
        }
    }, [messages])

    useEffect(() => {
        // load all messages on first load
        const messgeViewDiv = document.getElementById('MessageView');
        if (messgeViewDiv) {
            messgeViewDiv.scrollTop = messgeViewDiv.scrollHeight
        }
    }, [])

    const sendMessageClickHandler = () => sendMessage(JSON.stringify({
        action: 'message', messageProps: {message, from: name, to: 'all'}
    } as SendMessageContainer));

    return (<div className="ChatView">
        <p>Name: {name || 'No name given'}</p>
        <p>Connection status: {connectionStatus}</p>
        <div className="MessageView" id="MessageView">
            <ul>{messages.map(messageTransformer)}</ul>
        </div>
        <label htmlFor="messageInput">Your Message</label><input id="messageInput" type="text"
                                                                 onChange={messageChangeHandler}/>
        <button id="messageSend" onClick={sendMessageClickHandler}>Send</button>
        <Link to="/">
            <button>Go to Welcome View</button>
        </Link>
    </div>);
}

export default ChatView
