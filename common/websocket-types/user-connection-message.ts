export type UserConnectionMessage = {
    messageType: 'USER_CONNECTED' | 'USER_DISCONNECTED',
    username: string
}