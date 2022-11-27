import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { RestApi } from '../services/rest-api';
import './UserList.css';
import { ReadyState } from 'react-use-websocket'

function UserList(props: { readyState: ReadyState }) {

    const [connectedUsers, setConnectedUsers] = useState<string[]>([])

    useEffect(() => {
        if (props.readyState === ReadyState.OPEN) {
            RestApi.getConnectedUsers().then(users => setConnectedUsers(users))
        }
    }, [props.readyState])

    return (<div className="UserList">
        <p><b>Users</b></p>
        <ul>
            {connectedUsers.map(name => <li key={uuid()}>{name}</li>)}
        </ul>
    </div>);
}

export default UserList
