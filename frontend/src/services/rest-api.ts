import {StoredMessageProps} from "../../../common/websocket-types/chat-message";

const baseUrl = 'https://chat-rest-api.mloesch.it/'
export const RestApi = {
    getAllMessages: async (): Promise<StoredMessageProps[]> => {
        return fetch(`${baseUrl}message`, {
            method: 'GET',
            mode: 'cors'
        }).then(result => result.json()).then(messages => messages.messages as StoredMessageProps[])
    }
}