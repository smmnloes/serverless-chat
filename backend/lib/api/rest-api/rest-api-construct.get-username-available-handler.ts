import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from 'aws-lambda';
import DynamoDB from 'aws-sdk/clients/dynamodb';


export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2> => {
    const connectionTable = process.env.CONNECTION_TABLE_NAME || (() => { throw new Error('No connection table name supplied') })()
    console.log('Querying connection ids');
    const username = event.pathParameters?.username
    if (!username) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'No username given' })
        }
    }
    const userNames = (await new DynamoDB.DocumentClient().query({
        TableName: connectionTable,
        IndexName: 'NameIndex',
        KeyConditionExpression: '#n = :n',
        ExpressionAttributeNames: { '#n': 'name' },
        ExpressionAttributeValues: { ':n': username }
    }).promise()).Items;
    console.log('Retrieved usernames:' + JSON.stringify(userNames))
    if (userNames && userNames.length > 0) {
        return {
            statusCode: 409,
            body: JSON.stringify({ message: `Username ${username} is already connected` })
        }
    } else {
        return {
            statusCode: 200
        }
    }


}