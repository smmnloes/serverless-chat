import {APIGatewayProxyResultV2} from 'aws-lambda';
import {DynamoDB} from 'aws-sdk';
import {sortByStringDesc} from "../../util/sort";
import {StoredMessageProps} from "../../../../common/websocket-types/chat-message";

const MAX_MESSAGES_LIMIT = 30

export const handler = async (): Promise<APIGatewayProxyResultV2> => {
    const messagesTable = process.env.MESSAGES_TABLE_NAME || (() => {
        throw new Error('No messages table name supplied')
    })()
    console.log('Querying messages');
    const documentClient = new DynamoDB.DocumentClient();
    const allMessages = (await documentClient.scan({TableName: messagesTable}).promise()).Items as StoredMessageProps[];
    allMessages.sort((messageA, messageB) => sortByStringDesc(messageA.sentAt, messageB.sentAt))
    let messagesToReturn: StoredMessageProps[]
    if (!allMessages) {
        messagesToReturn = []
    } else if (allMessages.length > MAX_MESSAGES_LIMIT) {
        console.log('To many messages in table, deleting superfluous ones')
        await deleteSuperfluousMessages(allMessages, documentClient, messagesTable)
        messagesToReturn = allMessages.slice(0, MAX_MESSAGES_LIMIT)
    } else {
        messagesToReturn = allMessages
    }

    console.log(`Retrieved latest messages`);

    return {
        statusCode: 200,
        body: JSON.stringify({messages: messagesToReturn}),
        headers: {'Access-Control-Allow-Origin': '*'}
    };

}

/**
 * Deletes all messages from the table that exceed the limit, leaving only the most recent ones
 * @param messagesSorted List of all message table rows, sorted in descending order by sentAt property
 * @param documentClient
 * @param messagesTable table name of messages table
 */
async function deleteSuperfluousMessages(messagesSorted: StoredMessageProps[], documentClient: DynamoDB.DocumentClient, messagesTable: string): Promise<void> {
    const messagesToDelete = messagesSorted.slice(MAX_MESSAGES_LIMIT, messagesSorted.length)
    console.log('Deleting ' + messagesToDelete.length + ' items')

    while (messagesToDelete.length > 0) {
        const currentBatch = messagesToDelete.splice(0, 25)
        await documentClient.batchWrite({
            RequestItems: {
                [messagesTable]: currentBatch.map(message => ({
                    DeleteRequest: {Key: {id: message.id}}
                }))
            }
        }).promise()
    }


}