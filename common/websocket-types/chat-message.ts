import {WSAction} from "./actions"

export interface SendMessageContainer {
    action: WSAction.MESSAGE
    messageProps: SendMessageProps
}

export type SendMessageProps = {
    message: string, from: string, to: 'all' | string
}

export type RecieveMessageProps = {
    messageType: 'MESSAGE',
    messageProps: StoredMessageProps
}

export type StoredMessageProps = {
    message: string, from: string, to: string, sentAt: string, id: string
}