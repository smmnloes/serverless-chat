import { client, connection, Message } from "websocket";

export interface Listeners {
    onError: (err: Error) => void
    onClose: (code: number, desc: string) => void
    onMessage: (data: Message) => void
}

export class WebsocketService {
   readonly websocketClient 
    constructor() {
        this.websocketClient = new client()
    }

    public async connect (listeners: Listeners): Promise<connection> {
        return new Promise((resolve, reject) => {
            this.websocketClient.on('connect', (connection:connection) => {
                connection.on('error', listeners.onError) 
                connection.on('message', listeners.onMessage)
                connection.on('close', listeners.onClose)
                resolve(connection)
            })
            this.websocketClient.on('connectFailed', (error) => {
                reject(error)
            })
            this.websocketClient.connect('wss://chat-ws-api.mloesch.it/?name=Frank')
        }) 
    }
}