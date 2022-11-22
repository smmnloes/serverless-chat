import {StoredMessageProps} from "../../../common/websocket-types/chat-message";
import {baseUrlRest} from "../config/urls";

export const RestApi = {
    getAllMessages: async (): Promise<StoredMessageProps[]> => {
        return fetch(`${baseUrlRest}message`, {
            method: 'GET', mode: 'cors'
        }).then(result => result.json()).then(messages => messages.messages as StoredMessageProps[])
    }
}