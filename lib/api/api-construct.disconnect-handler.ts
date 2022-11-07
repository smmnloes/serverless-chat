import { APIGatewayProxyWebsocketHandlerV2, APIGatewayProxyWebsocketEventV2, APIGatewayProxyResultV2, APIGatewayProxyEvent } from 'aws-lambda'
import { ApiGatewayManagementApi, DynamoDB } from 'aws-sdk';


export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2> => {
    console.log(JSON.stringify(event, null, 4))
    const connectionTable = process.env.CONNECTION_TABLE || (() => { throw new Error('No connection table name supplied') })()

    const documentClient = new DynamoDB.DocumentClient()
    await documentClient.delete({ TableName: connectionTable, Key: { connectionId: event.requestContext.connectionId } }).promise()

    return {
        statusCode: 200
    }

}