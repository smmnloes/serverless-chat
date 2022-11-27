import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from 'aws-lambda';
import { ApiGatewayManagementApi, DynamoDB } from 'aws-sdk';
import { AttributeMap } from 'aws-sdk/clients/dynamodb';
import { UserConnectionMessage } from '../../../../common/websocket-types/user-connection-message';
import { ConnectionTableItem } from '../../datamodel/connection-table';
import { scanComplete } from '../../util/dynamodb';


export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2> => {
    console.log(JSON.stringify(event, null, 4))
    const connectionTable = process.env.CONNECTION_TABLE_NAME || (() => { throw new Error('No connection table name supplied') })()

    const documentClient = new DynamoDB.DocumentClient()
    const currentDisconnectionId = event.requestContext.connectionId;

    await sendDisconnectMessageToAll(documentClient, connectionTable, currentDisconnectionId);
    await documentClient.delete({ TableName: connectionTable, Key: { connectionId: currentDisconnectionId } }).promise()
    

    return {
        statusCode: 200
    }

}

async function sendDisconnectMessageToAll(documentClient: DynamoDB.DocumentClient, connectionTable: string, currentDisconnectionId: string | undefined) {
    console.log("getting name for connectionId " + currentDisconnectionId)
    const disconnectingUserName: string = (await documentClient.get({ TableName: connectionTable, Key: { connectionId: currentDisconnectionId } }).promise()).Item?.name
    console.log("disconnecting user name: " + disconnectingUserName)

    if (disconnectingUserName) {
        // Send user connected Message to all users
        const callBackUrl = process.env.CALLBACK_URL || (() => {
            throw new Error('No callback url supplied')
        })()
        const callbackAPI = new ApiGatewayManagementApi({
            apiVersion: '2018-11-29', endpoint: callBackUrl
        });
        const connectedClientIds = (await scanComplete({ TableName: connectionTable })).map((item: AttributeMap) => (item as ConnectionTableItem).connectionId);
        // remove currently disconnecting user from list
        const connectedIdsWithoutCurrentlyDisconnectingUser = connectedClientIds.filter(id => id !== currentDisconnectionId);
        console.log("Sending disconnect message to " + JSON.stringify(connectedIdsWithoutCurrentlyDisconnectingUser))
        await Promise.all(connectedIdsWithoutCurrentlyDisconnectingUser.map(connectionId => callbackAPI.postToConnection({
            ConnectionId: connectionId, Data: JSON.stringify({
                messageType: 'USER_DISCONNECTED', username: disconnectingUserName
            } as UserConnectionMessage)
        }).promise()));
    }
}
