import { client, connection, Message } from "websocket";

export interface Listeners {
    onConnected: ((connection: connection) => void)
    onError: (err: Error) => void
    onClose: (code: number, desc: string) => void
    onMessage: (data: Message) => void
}


export const webSocketService = (url: string, listeners: Listeners): void => {
    const websocketClient: client = new client()
    let connectionConnected: connection
    websocketClient.on('connect', (connection:connection) => {
        connection.on('error', listeners.onError) 
        connection.on('message', listeners.onMessage)
        connection.on('close', listeners.onClose)
        connectionConnected = connection
        listeners.onConnected(connection)
    })
    websocketClient.on('connectFailed', (error) => {
        throw error
    })
    websocketClient.connect(url)
}