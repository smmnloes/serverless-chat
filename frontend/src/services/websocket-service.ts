import { client, connection, Message } from "websocket";

export interface Listeners {
    onError: (err: Error) => void
    onClose: (code: number, desc: string) => void
    onMessage: (data: Message) => void
}


export const webSocketService = async (url: string, listeners: Listeners): Promise<connection> => {
    return new Promise((resolve, reject) => {
        const websocketClient: client = new client()
        let connectionConnected: connection
        websocketClient.on('connect', (connection:connection) => {
            connection.on('error', listeners.onError) 
            connection.on('message', listeners.onMessage)
            connection.on('close', listeners.onClose)
            connectionConnected = connection
            resolve(connection)
        })
        websocketClient.on('connectFailed', (error) => {
            reject(error)
        })
        websocketClient.connect(url)
    })
    
}