import { client } from "websocket";
import * as readline from 'readline'
import { RecieveMessage, SendChatMessage } from "../lib/websocket-types/chat-message";

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


    const rlInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    let input: string = ''

    rlInterface.question('Enter message ', message => {
        input = message
        connection.sendUTF(JSON.stringify({ action: 'message', message } as SendChatMessage));
    })

})

ws_client.connect('wss://n12pfc9wah.execute-api.eu-central-1.amazonaws.com/prod')
