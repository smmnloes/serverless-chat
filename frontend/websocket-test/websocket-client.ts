import { client } from "websocket";
import promptSync from 'prompt-sync';
import { SendMessageContainer } from "../../common/websocket-types/chat-message";

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
ws_client.on('connectFailed', (reason) => {
    console.log(reason)
})

ws_client.connect('wss://chat-ws-api.mloesch.it/?name=' + name)
