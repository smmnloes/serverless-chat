import {MessagesTable} from "../../../common/rest-types/messages-table";

const baseUrl = 'https://chat-rest-api.mloesch.it/'
export const RestApi = {
    getAllMessages: async (): Promise<MessagesTable[]> => {
        return fetch(`${baseUrl}message`, {method: 'GET'}).then(result => result.json() as unknown as MessagesTable[])
    }
}