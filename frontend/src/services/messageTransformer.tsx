import React from "react";
import { RecieveMessage, StoredMessageProps } from "../../../common/websocket-types/chat-message";
import { UserConnectionMessage } from "../../../common/websocket-types/user-connection-message";
import { v4 as uuid } from 'uuid';

export const messageTransformer = (message: RecieveMessage | UserConnectionMessage) => {
    if (message.messageType === 'MESSAGE') {
        const messageProps = message.messageProps as StoredMessageProps
        const sentAtDate = new Date(messageProps.sentAt);
        const dateTimeString = `${sentAtDate.getDate()}.${sentAtDate.getMonth() + 1}., ${pad(sentAtDate.getHours(), 2)}:${pad(sentAtDate.getMinutes(), 2)}`
        return <li key={messageProps.id}><b>{messageProps.from} </b>
            <span>({dateTimeString})</span>: {messageProps.message}
        </li>
    } else if (message.messageType === 'USER_CONNECTED' || message.messageType === 'USER_DISCONNECTED') {
        const userConnectionMessage = message as UserConnectionMessage
        const messageType = message.messageType
        return <li key={uuid()}><i>User {userConnectionMessage.username} {messageType === 'USER_CONNECTED' ? 'connected' : 'disconnected'}</i></li>
    }

}

function pad(num: number, size: number) {
    let numString = num.toString();
    while (numString.length < size) numString = "0" + numString;
    return numString;
}