import { APIGatewayProxyWebsocketHandlerV2, APIGatewayProxyWebsocketEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import { ApiGatewayManagementApi, DynamoDB } from 'aws-sdk';
import { AttributeMap } from 'aws-sdk/clients/dynamodb';
import { ConnectionTableItem } from '../datamodel/connection-table';
import { scanComplete } from '../util/dynamodb';
import { MessageProps, SendMessageContainer } from '../websocket-types/chat-message';

export const handler: APIGatewayProxyWebsocketHandlerV2 = async (event: APIGatewayProxyWebsocketEventV2): Promise<APIGatewayProxyResultV2> => {
    console.log(JSON.stringify(event, null, 4))
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: 'No message body'
            })
        }
    }

    const body = JSON.parse(event.body) as SendMessageContainer
    const incomingMessage = body.messageProps.message
    const callBackUrl = process.env.CALLBACK_URL || (() => { throw new Error('No callback url supplied') })()
    const connectionTable = process.env.CONNECTION_TABLE || (() => { throw new Error('No connection table name supplied') })()

    const callbackAPI = new ApiGatewayManagementApi({
        apiVersion: '2018-11-29',
        endpoint: callBackUrl
    });

    console.log('Querying connection ids')
    const connectedClientIds = (await scanComplete({ TableName: connectionTable })).map((item: AttributeMap) => (item as ConnectionTableItem).connectionId)
    console.log('Connection Ids: ' + connectedClientIds)
    console.log('Posting to connections')
    await Promise.all(
        connectedClientIds.map(
            connectionId =>
                callbackAPI.postToConnection(
                    { ConnectionId: connectionId, Data: JSON.stringify({ from: body.messageProps.from, to: body.messageProps.to, message: incomingMessage } as MessageProps) }
                ).promise())
    )
    console.log('Posted to connections')
    return { statusCode: 200 }
}

const bla: { [key: string]: any } = { connectionId: 123 }