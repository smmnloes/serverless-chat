import { APIGatewayProxyResultV2, APIGatewayProxyEvent } from 'aws-lambda'
import { ApiGatewayManagementApi, DynamoDB } from 'aws-sdk';
import { AttributeMap } from 'aws-sdk/clients/dynamodb';
import { ConnectionTableItem } from '../../datamodel/connection-table';
import { scanComplete } from '../../util/dynamodb';
import { UserConnectionMessage } from '../../../../common/websocket-types/user-connection-message';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2> => {
    console.log(JSON.stringify(event, null, 4))
    const connectionTable = process.env.CONNECTION_TABLE_NAME || (() => { throw new Error('No connection table name supplied') })()

    const connectingUsername = event.queryStringParameters?.name
    const currentConnectionId = event.requestContext.connectionId
    const documentClient = new DynamoDB.DocumentClient({})


    
    // Send user connected Message to all users
    
    const usernameExists = await userNameAlreadyExists(connectingUsername, connectionTable, documentClient)
    if (usernameExists) {
        const errorMessage = `User with name '${connectingUsername}' already exists`;
        console.log(errorMessage)
        return {
            statusCode: 409,
            body: JSON.stringify({ message: errorMessage })
        }
    }
    await sendConnectMessageToAll(connectionTable, currentConnectionId, connectingUsername);
    await documentClient.put({ TableName: connectionTable, Item: { connectionId: currentConnectionId, name: connectingUsername } as ConnectionTableItem }).promise()
    return { statusCode: 200 };
}

async function sendConnectMessageToAll(connectionTable: string, currentConnectionId: string | undefined, connectingUsername: string | undefined) {

    const callBackUrl = process.env.CALLBACK_URL || (() => {
        throw new Error('No callback url supplied')
    })()
    const callbackAPI = new ApiGatewayManagementApi({
        apiVersion: '2018-11-29', endpoint: callBackUrl
    });

    const connectedClientIds = (await scanComplete({ TableName: connectionTable })).map((item: AttributeMap) => (item as ConnectionTableItem).connectionId);
    // remove currently connected user from list (not connected yet)
    const connectedClientIdsWithoutCurrentlyConnectingUser = connectedClientIds.filter(id => id !== currentConnectionId);
    console.log("Sending connect message to " + JSON.stringify(connectedClientIdsWithoutCurrentlyConnectingUser))
    await Promise.all(connectedClientIdsWithoutCurrentlyConnectingUser.map(connectionId => callbackAPI.postToConnection({
        ConnectionId: connectionId, Data: JSON.stringify({
            messageType: 'USER_CONNECTED', username: connectingUsername
        } as UserConnectionMessage)
    }).promise()));
}

async function userNameAlreadyExists(connectingUsername: string | undefined, connectionTable: string, documentClient: DynamoDB.DocumentClient): Promise<boolean> {
    console.log('Checking if user already exists')
    const usersForName = (await documentClient.query({
        TableName: connectionTable,
        IndexName: 'NameIndex',
        KeyConditionExpression: '#n = :n',
        ExpressionAttributeNames: { '#n': 'name' },
        ExpressionAttributeValues: { ':n': connectingUsername }
    }).promise()).Items
    return (usersForName !== undefined && usersForName.length > 0)
}