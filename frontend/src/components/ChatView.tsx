import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import useWebSocket from "react-use-websocket";
import { RecieveMessageProps, SendMessageContainer, StoredMessageProps } from "../../../common/websocket-types/chat-message";
import { UserConnectionMessage } from "../../../common/websocket-types/user-connection-message";
import { connectionStatusColors, connectionStatusText } from '../config/connectionStatus';
import { baseUrlWebsocket } from "../config/urls";
import { messageTransformer } from "../services/messageTransformer";
import { RestApi } from "../services/rest-api";
import { sortByStringAsc } from "../util/sort";
import './ChatView.css';

function ChatView() {
    const location = useLocation()
    const { name } = location.state
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState<StoredMessageProps[]>([])

    function messageChangeHandler(e: React.FormEvent<HTMLInputElement>) {
        setMessage(e.currentTarget.value)
    }

    function messageOnKeyUpHandler(e: React.KeyboardEvent<HTMLElement>) {
        if (e.key === "Enter") {
            sendMessageClickHandler()
            setMessage('')
        }
    }

    const sendMessageClickHandler = () => {
        if (message && name) {
            sendMessage(JSON.stringify({
                action: 'message', messageProps: { message, from: name, to: 'all' }
            } as SendMessageContainer))
            setMessage('')
        }
    };
    const { sendMessage, lastMessage, readyState } = useWebSocket(baseUrlWebsocket, {
        queryParams: { name },
        onError: (error: any) => console.log(error),
        shouldReconnect: () => true,
        retryOnError: true,
        reconnectAttempts: 5,
        reconnectInterval: 3000
    });


    useEffect(() => {
        if (lastMessage !== null) {
            const lastMessageData = JSON.parse(lastMessage.data)
            console.log(JSON.stringify(lastMessageData))
            if (lastMessageData.messageType === 'USER_CONNECTED') {
                console.log("User connected: " + (lastMessageData as UserConnectionMessage).username)
            }
            if (lastMessageData.messageType === 'USER_DISCONNECTED') {
                console.log("User disconnected: " + (lastMessageData as UserConnectionMessage).username)
            }
            if (lastMessageData.messageType === 'MESSAGE') {
                setMessages((prev) => prev.concat((lastMessageData as RecieveMessageProps).messageProps));
            }
        }
    }, [lastMessage, setMessages]);

    const connectionStatus = connectionStatusText[readyState];
    const connectionStatusStyle = {
        color: connectionStatusColors[readyState]
    }


    useEffect(() => {
        // scroll down in div
        const messgeViewDiv = document.getElementById('MessageView');
        if (messgeViewDiv) {
            messgeViewDiv.scrollTop = messgeViewDiv.scrollHeight
        }
    }, [messages])

    useEffect(() => {
        // load all messages on first load
        (async () => {
            console.log('Fetching latest messages')
            const latestMessages = (await RestApi.getAllMessages())
                .sort((messageA, messageB) => sortByStringAsc(messageA.sentAt, messageB.sentAt))
            setMessages(latestMessages)
        })()
    }, [])

    return (<div className="ChatView">
        <div className='TopControls'>
            <p>Name: <b>{name || 'No name given'}</b></p>
            <p>Status: <b style={connectionStatusStyle}>{connectionStatus}</b></p>
        </div>
        <div className='MessageAndControls'>
            <div className="MessageView" id="MessageView">
                <ul>{messages.map(messageTransformer)}</ul>
            </div>
            <div className='BottomControls'>
                <input id="messageInput" type="text"
                    onChange={messageChangeHandler}
                    onKeyUp={messageOnKeyUpHandler}
                    value={message} />
                <button id="messageSend" onClick={sendMessageClickHandler}>Send</button>
            </div>
        </div>
    </div>);
}

export default ChatView
