import React from "react";
import {RecieveMessageProps} from "../../../common/websocket-types/chat-message";

export const messageTransformer = (message: RecieveMessageProps) => {
    const sentAtDate = new Date(message.sentAt);
    return <li key={message.id}><b>{message.from}</b>
        <span>({sentAtDate.toLocaleDateString()}, {sentAtDate.toLocaleTimeString()})</span>: {message.message}</li>
}