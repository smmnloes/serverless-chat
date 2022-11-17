import {client, connection, Message, w3cwebsocket} from "websocket";

export interface Listeners {
    onError: (err: Error) => void
    onClose: (code: number, desc: string) => void
    onMessage: (data: Message) => void
}


export const webSocketService = async (url: string, listeners: Listeners): Promise<connection> => {
    return new Promise((resolve, reject) => {

    })
    
}