import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router';
import {Link} from 'react-router-dom';
import './ChatView.css';
import {w3cwebsocket} from "websocket";
import {RecieveMessageProps} from "../../../common/websocket-types/chat-message";
import {messageTransformer} from "../services/messageTransformer";

enum ConnectionStatus {
    CONNECTED = 'connected', DISCONNECTED = 'disconnected', CONNECTING = 'connecting...'
}


function ChatView() {
    const location = useLocation()
    const {name} = location.state
    const [connectionStatus, setConnectionStatus] = useState(ConnectionStatus.DISCONNECTED)
    const [websocketClient, setWebsocketClient] = useState<w3cwebsocket | null>(null)
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState<RecieveMessageProps[]>([])

    function messageChangeHandler(e: React.FormEvent<HTMLInputElement>) {
        setMessage(e.currentTarget.value)
    }


    // Init websocket connection
    useEffect(() => {
        const client: w3cwebsocket = new w3cwebsocket('wss://chat-ws-api.mloesch.it/?name=' + name)

        client.onmessage = (message) => {
            setMessages(prev => {
                console.log("recieved message " + JSON.stringify(message.data))
                if (typeof message.data === "string") {
                    return [...prev, JSON.parse(message.data) as RecieveMessageProps]
                } else {
                    console.log("Unknown messge format")
                    return prev
                }
            })
            // scroll down in div
            const messgeViewDiv = document.getElementById('MessageView');
            if (messgeViewDiv){
                messgeViewDiv.scrollTop = messgeViewDiv.scrollHeight
            }

        }

        client.onerror = error => console.log(error)
        client.onclose = () => console.log('Connection closed')
        client.onopen = () => {
            console.log('connected');
            waitForConnection()

            // wait for connection
            function waitForConnection() {
                console.log('Waiting for client to be ready')
                setConnectionStatus(ConnectionStatus.CONNECTING)
                if (client.readyState === w3cwebsocket.OPEN) {
                    console.log('client ready! proceeding')
                    setConnectionStatus(ConnectionStatus.CONNECTED)
                } else {
                    setTimeout(waitForConnection, 1000)
                }
            }

            setWebsocketClient(client)
        }
        return function cleanup() {
            client.close()
        }
    }, [])

    // Display messages
    useEffect(() => {

    }, [messages])

    function sendMessageClickHandler() {
        console.log("sending message")
        if (websocketClient) {
            console.log("websocketclient initialized")
            websocketClient.send(JSON.stringify({
                action: 'message', messageProps: {message, from: name, to: 'all'}
            }))
        } else {
            console.log("client not initialized")
        }

    }

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
