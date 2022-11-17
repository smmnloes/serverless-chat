import promptSync from 'prompt-sync';
import {w3cwebsocket} from 'websocket';


async function doIt() {
    const prompt = promptSync()
    const name = prompt('Whats your name?   ')
    const message = prompt('Enter message!   ')
    const to = prompt('To who?   ')
    const websocketClient: w3cwebsocket = new w3cwebsocket('wss://chat-ws-api.mloesch.it/?name=' + name)
    websocketClient.onmessage = (message) => console.log(message.data)
    websocketClient.onclose = (close) => console.log(close.code)
    websocketClient.onopen = () => {
        console.log('connected');
        waitForConnection()

        // wait for connection
        function waitForConnection() {
            console.log('Sending message')
            if (websocketClient.readyState === w3cwebsocket.OPEN) {
                console.log('client ready! proceeding')
            } else {
                setTimeout(waitForConnection, 1000)
            }
        }
        console.log('Sending message')
        websocketClient.send(JSON.stringify({action: 'message', messageProps: {message, from: name, to: to}}));
    }
}

doIt()