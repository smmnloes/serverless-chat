import { StoredMessageProps } from "../../../common/websocket-types/chat-message";
import { baseUrlRest } from "../config/urls";

export const RestApi = {
    getAllMessages: async (): Promise<StoredMessageProps[]> => {
        return fetch(`${baseUrlRest}message`, {
            method: 'GET', mode: 'cors'
        }).then(result => result.json()).then(messages => messages.messages as StoredMessageProps[])
    }
    ,
    getUsernameAvailable: async (username: string): Promise<boolean> => {
        return fetch(`${baseUrlRest}user/${username}`, {
            method: 'GET', mode: 'cors'
        }).then(result => result.status === 200)
    }
}