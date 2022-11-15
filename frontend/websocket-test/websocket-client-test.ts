import promptSync from 'prompt-sync';
import { connection, Message } from 'websocket';
import { Listeners, webSocketService } from '../src/services/websocket-service';


async function doIt() {
    
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
        }

    }
    const prompt = promptSync()
    const name = prompt('Whats your name?   ')
    const message = prompt('Enter message!   ')
    const to = prompt('To who?   ')
    const connection = await webSocketService('wss://chat-ws-api.mloesch.it/?name=' + name, listeners)
    connection.sendUTF(JSON.stringify({ action: 'message', messageProps: { message, from: name, to: to } }));

}

doIt()