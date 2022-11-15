import promptSync from 'prompt-sync';
import { Message } from 'websocket';
import { Listeners, webSocketService } from '../src/services/websocket-service';


async function doIt() {
    const prompt = promptSync()
    const name = prompt('Whats your name?   ')

    const listeners: Listeners = {
        onError: function (err: Error): void {
            console.log(err);
        },
        onClose: function (code: number, desc: string): void {
            console.log(code);
        },
        onMessage: function (data: Message): void {
            if (data.type === 'utf8') {
                console.log(data.utf8Data);
            }
        },
        onConnected: function (connection): void {
            console.log('Connected')
            const message = prompt('Enter message!   ')
            const to = prompt('To who?   ')
            connection.sendUTF(JSON.stringify({ action: 'message', messageProps: { message, from: name, to: to } }));
        }

    }

    const connection = webSocketService('wss://chat-ws-api.mloesch.it/?name=' + name, listeners)

}

doIt()