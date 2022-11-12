import { APIGatewayProxyResultV2, APIGatewayProxyWebsocketEventV2, APIGatewayProxyWebsocketHandlerV2 } from 'aws-lambda';

export const handler: APIGatewayProxyWebsocketHandlerV2 = async (event: APIGatewayProxyWebsocketEventV2): Promise<APIGatewayProxyResultV2> => {
    console.log(JSON.stringify(event, null, 4))
    return { body: JSON.stringify({error: 'Unknown route ' + event.requestContext.routeKey}),statusCode: 200 }
}