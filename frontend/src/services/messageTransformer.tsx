import React from "react";
import { StoredMessageProps } from "../../../common/websocket-types/chat-message";

export const messageTransformer = (message: StoredMessageProps) => {
    const sentAtDate = new Date(message.sentAt);
    const dateTimeString = `${sentAtDate.getDate()}.${sentAtDate.getMonth() + 1}., ${pad(sentAtDate.getHours(), 2)}:${pad(sentAtDate.getMinutes(), 2)}`
    return <li key={message.id}><b>{message.from} </b>
        <span>({dateTimeString})</span>: {message.message}
    </li>
}

function pad(num: number, size: number) {
    let numString = num.toString();
    while (numString.length < size) numString = "0" + numString;
    return numString;
}