import { APIGatewayProxyWebsocketHandlerV2, APIGatewayProxyWebsocketEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import { ApiGatewayManagementApi } from 'aws-sdk';


export const handler: APIGatewayProxyWebsocketHandlerV2 = async (event: APIGatewayProxyWebsocketEventV2): Promise<APIGatewayProxyResultV2> => {
    console.log(JSON.stringify(event, null, 4))

    const callBackUrl = process.env.CALLBACK_URL

    const callbackAPI = new ApiGatewayManagementApi({
        apiVersion: '2018-11-29',
        endpoint: callBackUrl
    });

    await callbackAPI.postToConnection({ ConnectionId: event.requestContext.connectionId, Data: `Recieved number: ${event.body}`}).promise()
    return {
        statusCode: 200,
    }
}