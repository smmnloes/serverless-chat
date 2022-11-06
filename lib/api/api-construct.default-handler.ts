import { APIGatewayProxyWebsocketHandlerV2, APIGatewayProxyWebsocketEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'

export const handler: APIGatewayProxyWebsocketHandlerV2 = async (event: APIGatewayProxyWebsocketEventV2): Promise<APIGatewayProxyResultV2> => {
    console.log(JSON.stringify(event, null, 4))
    return {
        statusCode: 200,
        body: "hello client"
    }
}