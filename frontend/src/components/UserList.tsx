import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { RestApi } from '../services/rest-api';
import './UserList.css';
import { ReadyState } from 'react-use-websocket'
import { RecieveMessage } from '../../../common/websocket-types/chat-message';
import { UserConnectionMessage } from '../../../common/websocket-types/user-connection-message';

function UserList(props: { readyState: ReadyState, lastMessage: RecieveMessage | UserConnectionMessage }) {

    const [connectedUsers, setConnectedUsers] = useState<string[]>([])

    useEffect(() => {
        console.log('ready state change')
        if (props.readyState === ReadyState.OPEN) {
            RestApi.getConnectedUsers().then(users => setConnectedUsers(users))
        }
    }, [props.readyState])

    useEffect(() => {
        console.log('Updating user list')
        const lastMessage = props.lastMessage;
        console.log(lastMessage)
        if (lastMessage && (lastMessage.messageType === 'USER_CONNECTED' || lastMessage.messageType === 'USER_DISCONNECTED')) {
            const userConnectedMessage = props.lastMessage as UserConnectionMessage
            if (props.lastMessage.messageType === 'USER_DISCONNECTED') {
                setConnectedUsers(prev => { console.log('Prev users' + prev); return prev.filter(username => username !== userConnectedMessage.username) })
            }
            if (props.lastMessage.messageType === 'USER_CONNECTED') {
                setConnectedUsers(prev => [...prev, userConnectedMessage.username])
            }
        }
    }, [props.lastMessage])

    return (<div className="UserList">
        <p className="UserHeading"><b>Users</b></p>
        <ul>
            {connectedUsers.map(name => <li key={uuid()}>{name}</li>)}
        </ul>
    </div>);
}

export default UserList
