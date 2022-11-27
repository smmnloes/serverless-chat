import { WSAction } from "./actions";
export interface SendMessageContainer {
    action: WSAction.MESSAGE;
    messageProps: SendMessageProps;
}
export declare type SendMessageProps = {
    message: string;
    from: string;
    to: 'all' | string;
};
export declare type RecieveMessage = {
    messageType: 'MESSAGE';
    messageProps: StoredMessageProps;
};
export declare type StoredMessageProps = {
    message: string;
    from: string;
    to: string;
    sentAt: string;
    id: string;
};
