import React, { useEffect, useState } from 'react';
import { ReadyState } from 'react-use-websocket';
import { v4 as uuid } from 'uuid';
import { UserConnectionMessage } from '../../../common/websocket-types/user-connection-message';
import { RestApi } from '../services/rest-api';
import './UserList.css';

function UserList(props: { readyState: ReadyState, lastUserConnectionMessage: UserConnectionMessage | null}) {

    const [connectedUsers, setConnectedUsers] = useState<string[]>([])
    
    useEffect(() => {
        console.log('ready state change')
        if (props.readyState === ReadyState.OPEN) {
            RestApi.getConnectedUsers().then(users => setConnectedUsers(users))
        }
    }, [props.readyState])

    useEffect(() => {
        console.log('Updating user list')
        const lastMessage = props.lastUserConnectionMessage;
        console.log(lastMessage)
        if (lastMessage) {
            if (lastMessage.messageType === 'USER_DISCONNECTED') {
                setConnectedUsers(prev => { return prev.filter(username => username !== lastMessage.username) })
            }
            if (lastMessage.messageType === 'USER_CONNECTED') {
                setConnectedUsers(prev => [...prev, lastMessage.username])
            }
        }
    }, [props.lastUserConnectionMessage?.messageType, props.lastUserConnectionMessage?.username])

    return (<div className="UserList">
        <p className="UserHeading"><b>Users</b></p>
        <ul>
            {connectedUsers.map(name => <li key={uuid()}>{name}</li>)}
        </ul>
    </div>);
}

export default UserList
