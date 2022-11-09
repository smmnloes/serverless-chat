import { client } from "websocket";
import { SendMessageContainer } from "../lib/websocket-types/chat-message";
import promptSync from 'prompt-sync';

const prompt = promptSync()
const name = prompt('Whats your name?   ')

const ws_client = new client()
ws_client.on('connect', (connection) => {
    console.log('WebSocket Client Connected');
    connection.on('error', function (error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function () {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function (messageString) {
        if (messageString.type === 'utf8') {
            console.log(messageString.utf8Data);
        }
    });

    const message = prompt('Enter message!   ')
    const to = prompt('To who?   ')
    connection.sendUTF(JSON.stringify({ action: 'message', messageProps: { message, from: name, to } } as SendMessageContainer));
})

ws_client.connect('wss://n12pfc9wah.execute-api.eu-central-1.amazonaws.com/prod?name=' + name)
