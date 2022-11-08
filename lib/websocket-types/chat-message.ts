import { WSAction } from "./actions"


export type SendChatMessage = {
    action: WSAction.MESSAGE,
    message: string
}

export type RecieveMessage= {
    reciever: 'all' | string,
    message: string
}