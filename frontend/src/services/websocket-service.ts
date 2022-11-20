import {ICloseEvent, IMessageEvent, w3cwebsocket} from "websocket";
import {ConnectionStatus} from "../components/ChatView";

/**
 * Must return a cleanup function for useEffect
 * @param url
 * @param userName
 * @param onmessage
 * @param onerror
 * @param setWebsocketClient
 * @param setConnectionStatus
 */
export const websocketService = (url: string, userName: string, onmessage: (message: IMessageEvent) => void, onerror: (error: Error) => void, setWebsocketClient: React.Dispatch<React.SetStateAction<w3cwebsocket | null>>, setConnectionStatus: React.Dispatch<React.SetStateAction<ConnectionStatus>>): () => void => {
    let client: w3cwebsocket

    function clientSetup(): () => void {
        client = new w3cwebsocket(`${url}/?name=${userName}`)

        client.onmessage = onmessage
        client.onerror = onerror

        client.onclose = (event: ICloseEvent) => {
            console.log('Connection closed');
            console.log(JSON.stringify(event))
            setConnectionStatus(ConnectionStatus.DISCONNECTED)
        }
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
        // Cleanup function
        return () => {
            console.log('closing client')
            client.close()
        }
    }

    return clientSetup()


}