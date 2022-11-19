import { WSAction } from "./actions"

export interface SendMessageContainer {
    action: WSAction.MESSAGE
    messageProps: MessageProps
}

export type MessageProps = {
    message: string,
    from: string,
    to: 'all' | string
}

export type RecieveMessageProps = {
    message: string,
    from: string,
    to: string,
    sentAt: string
}