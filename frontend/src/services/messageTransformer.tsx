import React from "react";
import {StoredMessageProps} from "../../../common/websocket-types/chat-message";

export const messageTransformer = (message: StoredMessageProps) => {
    const sentAtDate = new Date(message.sentAt);
    return <li key={message.id}><b>{message.from}</b>
        <span>({sentAtDate.toLocaleDateString()}, {sentAtDate.toLocaleTimeString()})</span>: {message.message}</li>
}