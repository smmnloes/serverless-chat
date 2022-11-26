import { ReadyState } from "react-use-websocket"

export const connectionStatusColors = {
    [ReadyState.CONNECTING]: 'orange',
    [ReadyState.OPEN]: 'green',
    [ReadyState.CLOSING]: 'orange',
    [ReadyState.CLOSED]: 'red',
    [ReadyState.UNINSTANTIATED]: 'grey',
}
export const connectionStatusText = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'online',
    [ReadyState.CLOSING]: 'disconnecting',
    [ReadyState.CLOSED]: 'offline',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
}
