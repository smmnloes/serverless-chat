import {APIGatewayProxyEvent, APIGatewayProxyResultV2} from 'aws-lambda';
import {DynamoDB} from 'aws-sdk';

const DEFAULT_MESSAGES_LIMIT = 50

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2> => {
    const messagesTable = process.env.MESSAGES_TABLE_NAME || (() => { throw new Error('No messages table name supplied') })()
    const limit = Number.parseInt(event.queryStringParameters?.limit || DEFAULT_MESSAGES_LIMIT.toString()) || DEFAULT_MESSAGES_LIMIT
    console.log('Querying messages');
    const latestMessages = (await new DynamoDB.DocumentClient().scan({ TableName: messagesTable, Limit: limit }).promise()).Items;
    console.log(`Retrieved latest ${limit} messages`);

    return { statusCode: 200, body: JSON.stringify({ latestMessages }) };

}