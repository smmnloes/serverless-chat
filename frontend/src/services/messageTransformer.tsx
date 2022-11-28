import React from "react";
import { v4 as uuid } from 'uuid';
import { RecieveMessage, UserConnectionMessage } from "../../../common/websocket-types/chat-message";

export const messageTransformer = (message: RecieveMessage | UserConnectionMessage) => {
    if (message.messageType === 'MESSAGE') {
        const messageProps = message.messageProps;
        const sentAtDate = new Date(messageProps.sentAt);
        const dateTimeString = `${sentAtDate.getDate()}.${sentAtDate.getMonth() + 1}., ${pad(sentAtDate.getHours(), 2)}:${pad(sentAtDate.getMinutes(), 2)}`
        return <li key={messageProps.id}><b>{messageProps.from} </b>
            <span>({dateTimeString})</span>:<br/>{messageProps.message}
        </li>
    } else if (message.messageType === 'USER_CONNECTED' || message.messageType === 'USER_DISCONNECTED') {
        return <li key={uuid()}><i>User {message.username} {message.messageType === 'USER_CONNECTED' ? 'connected' : 'disconnected'}</i></li>
    }

}

function pad(num: number, size: number) {
    let numString = num.toString();
    while (numString.length < size) numString = "0" + numString;
    return numString;
}