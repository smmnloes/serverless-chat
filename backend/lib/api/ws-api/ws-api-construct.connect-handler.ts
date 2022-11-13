import { APIGatewayProxyResultV2, APIGatewayProxyEvent } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk';
import { ConnectionTableItem } from '../../datamodel/connection-table';


export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2> => {
    console.log(JSON.stringify(event, null, 4))
    const connectionTable = process.env.CONNECTION_TABLE_NAME || (() => { throw new Error('No connection table name supplied') })()
    const name = event.queryStringParameters?.name
    const connectionId = event.requestContext.connectionId
    const documentClient = new DynamoDB.DocumentClient({})
    
    console.log('Checking if user already exists')
    const usersForName = (await documentClient.query({TableName: connectionTable,
        IndexName: 'NameIndex',
        KeyConditionExpression: '#n = :n',
        ExpressionAttributeNames: { '#n': 'name' },
        ExpressionAttributeValues: { ':n': name }}).promise()).Items
    if (usersForName && usersForName.length > 0) {
        const errorMessage = `User with name '${name}' already exists`;
        console.log(errorMessage)
        return {
            statusCode: 409,
            body: JSON.stringify({message: errorMessage })
        }
    }
    await documentClient.put({ TableName: connectionTable, Item: { connectionId, name } as ConnectionTableItem }).promise()

    return {
        statusCode: 200
    }

}