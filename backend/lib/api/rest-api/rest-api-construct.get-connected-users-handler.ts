import { APIGatewayProxyResultV2 } from 'aws-lambda'
import { AttributeMap } from 'aws-sdk/clients/dynamodb';
import { ConnectionTableItem } from '../../datamodel/connection-table';
import { scanComplete } from '../../util/dynamodb';


export const handler = async (/*event: APIGatewayProxyEvent*/): Promise<APIGatewayProxyResultV2> => {
    const connectionTable = process.env.CONNECTION_TABLE_NAME || (() => { throw new Error('No connection table name supplied') })()
    console.log('Querying connection ids');
    const connectedUserNames = (await scanComplete({ TableName: connectionTable })).map((item: AttributeMap) => (item as ConnectionTableItem).name);
    console.log('Connected users: ' + connectedUserNames);

    return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ connectedUserNames })
    };

}