"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const aws_sdk_1 = require("aws-sdk");
const dynamodb_1 = require("../../util/dynamodb");
const crypto_1 = require("crypto");
const handler = async (event) => {
    console.log(JSON.stringify(event, null, 4));
    if (!event.body) {
        return {
            statusCode: 400, body: JSON.stringify({
                error: 'No message body'
            })
        };
    }
    const body = JSON.parse(event.body);
    const messageProps = body.messageProps;
    const incomingMessage = messageProps.message;
    const callBackUrl = process.env.CALLBACK_URL || (() => {
        throw new Error('No callback url supplied');
    })();
    const connectionTable = process.env.CONNECTION_TABLE_NAME || (() => {
        throw new Error('No connection table name supplied');
    })();
    const messagesTable = process.env.MESSAGES_TABLE_NAME || (() => {
        throw new Error('No messages table name supplied');
    })();
    const callbackAPI = new aws_sdk_1.ApiGatewayManagementApi({
        apiVersion: '2018-11-29', endpoint: callBackUrl
    });
    const documentClient = new aws_sdk_1.DynamoDB.DocumentClient();
    const sentAt = new Date().toISOString();
    let id = (0, crypto_1.randomUUID)();
    await documentClient.put({
        TableName: messagesTable, Item: {
            id, sentAt, from: messageProps.from, to: messageProps.to, message: incomingMessage
        }
    }).promise();
    if (messageProps.to === 'all') {
        return await sendToAll();
    }
    else {
        return await sendToOne();
    }
    async function sendToAll() {
        console.log('Querying connection ids');
        const connectedClientIds = (await (0, dynamodb_1.scanComplete)({ TableName: connectionTable })).map((item) => item.connectionId);
        console.log('Connection Ids: ' + connectedClientIds);
        console.log('Posting to connections');
        await Promise.all(connectedClientIds.map(connectionId => callbackAPI.postToConnection({
            ConnectionId: connectionId, Data: JSON.stringify({
                messageType: 'MESSAGE', messageProps: { from: messageProps.from, to: messageProps.to, message: incomingMessage, sentAt, id }
            })
        }).promise()));
        console.log('Posted to connections');
        return { statusCode: 200 };
    }
    async function sendToOne() {
        console.log('Querying connection id for name ' + messageProps.to);
        const items = (await documentClient
            .query({
            TableName: connectionTable,
            IndexName: 'NameIndex',
            KeyConditionExpression: '#n = :t',
            ExpressionAttributeNames: { '#n': 'name' },
            ExpressionAttributeValues: { ':t': messageProps.to }
        }).promise()).Items;
        if (items === undefined || items.length !== 1) {
            console.log('Error. Items retrieved was ' + items);
            return { statusCode: 500, body: JSON.stringify({ error: 'Could not match connectionID to name' }) };
        }
        const recipientConnectionId = items[0].connectionId;
        console.log('Recipient connection Id: ' + recipientConnectionId);
        console.log('Posting to connection');
        await callbackAPI.postToConnection({
            ConnectionId: recipientConnectionId, Data: JSON.stringify({
                messageType: 'MESSAGE', messageProps: { from: messageProps.from, to: messageProps.to, message: incomingMessage, sentAt, id }
            })
        }).promise();
        console.log('Posted to connections');
        return { statusCode: 200 };
    }
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3MtYXBpLWNvbnN0cnVjdC5tZXNzYWdlLWhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ3cy1hcGktY29uc3RydWN0Lm1lc3NhZ2UtaGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxxQ0FBNEQ7QUFJNUQsa0RBQW1EO0FBQ25ELG1DQUFtQztBQUU1QixNQUFNLE9BQU8sR0FBc0MsS0FBSyxFQUFFLEtBQXNDLEVBQW9DLEVBQUU7SUFDekksT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUMzQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRTtRQUNiLE9BQU87WUFDSCxVQUFVLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUNsQyxLQUFLLEVBQUUsaUJBQWlCO2FBQzNCLENBQUM7U0FDTCxDQUFBO0tBQ0o7SUFFRCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQXlCLENBQUE7SUFDM0QsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztJQUN2QyxNQUFNLGVBQWUsR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFBO0lBRTVDLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxJQUFJLENBQUMsR0FBRyxFQUFFO1FBQ2xELE1BQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQTtJQUMvQyxDQUFDLENBQUMsRUFBRSxDQUFBO0lBQ0osTUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsSUFBSSxDQUFDLEdBQUcsRUFBRTtRQUMvRCxNQUFNLElBQUksS0FBSyxDQUFDLG1DQUFtQyxDQUFDLENBQUE7SUFDeEQsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtJQUNKLE1B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QUssS0FBSyxTQUFTLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDM0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsR0FBRyxLQUFLLENBQUMsQ0FBQTtZQUNsRCxPQUFPLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEtBQUssRUFBRSxzQ0FBc0MsRUFBRSxDQUFDLEVBQUUsQ0FBQTtTQUN0RztRQUNELE1BQU0scUJBQXFCLEdBQUksS0FBSyxDQUFDLENBQUMsQ0FBeUIsQ0FBQyxZQUFZLENBQUE7UUFDNUUsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsR0FBRyxxQkFBcUIsQ0FBQyxDQUFDO1FBQ2pFLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUNyQyxNQUFNLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQztZQUMvQixZQUFZLEVBQUUscUJBQXFCLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQ3RELFdBQVcsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEVBQUUsSUFBSSxFQUFFLFlBQVksQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLFlBQVksQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFO2FBQzdHLENBQUM7U0FDdkIsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFBO1FBRVosT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQ3JDLE9BQU8sRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDL0IsQ0FBQztBQUNMLENBQUMsQ0FBQTtBQXRGWSxRQUFBLE9BQU8sV0FzRm5CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQVBJR2F0ZXdheVByb3h5UmVzdWx0VjIsIEFQSUdhdGV3YXlQcm94eVdlYnNvY2tldEV2ZW50VjIsIEFQSUdhdGV3YXlQcm94eVdlYnNvY2tldEhhbmRsZXJWMiB9IGZyb20gJ2F3cy1sYW1iZGEnXG5pbXBvcnQgeyBBcGlHYXRld2F5TWFuYWdlbWVudEFwaSwgRHluYW1vREIgfSBmcm9tICdhd3Mtc2RrJztcbmltcG9ydCB7IEF0dHJpYnV0ZU1hcCB9IGZyb20gJ2F3cy1zZGsvY2xpZW50cy9keW5hbW9kYic7XG5pbXBvcnQgeyBSZWNpZXZlTWVzc2FnZSwgU2VuZE1lc3NhZ2VDb250YWluZXIsIFN0b3JlZE1lc3NhZ2VQcm9wcyB9IGZyb20gJy4uLy4uLy4uLy4uL2NvbW1vbi93ZWJzb2NrZXQtdHlwZXMvY2hhdC1tZXNzYWdlJztcbmltcG9ydCB7IENvbm5lY3Rpb25UYWJsZUl0ZW0gfSBmcm9tICcuLi8uLi9kYXRhbW9kZWwvY29ubmVjdGlvbi10YWJsZSc7XG5pbXBvcnQgeyBzY2FuQ29tcGxldGUgfSBmcm9tICcuLi8uLi91dGlsL2R5bmFtb2RiJztcbmltcG9ydCB7IHJhbmRvbVVVSUQgfSBmcm9tICdjcnlwdG8nXG5cbmV4cG9ydCBjb25zdCBoYW5kbGVyOiBBUElHYXRld2F5UHJveHlXZWJzb2NrZXRIYW5kbGVyVjIgPSBhc3luYyAoZXZlbnQ6IEFQSUdhdGV3YXlQcm94eVdlYnNvY2tldEV2ZW50VjIpOiBQcm9taXNlPEFQSUdhdGV3YXlQcm94eVJlc3VsdFYyPiA9PiB7XG4gICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoZXZlbnQsIG51bGwsIDQpKVxuICAgIGlmICghZXZlbnQuYm9keSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDAwLCBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgZXJyb3I6ICdObyBtZXNzYWdlIGJvZHknXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgYm9keSA9IEpTT04ucGFyc2UoZXZlbnQuYm9keSkgYXMgU2VuZE1lc3NhZ2VDb250YWluZXJcbiAgICBjb25zdCBtZXNzYWdlUHJvcHMgPSBib2R5Lm1lc3NhZ2VQcm9wcztcbiAgICBjb25zdCBpbmNvbWluZ01lc3NhZ2UgPSBtZXNzYWdlUHJvcHMubWVzc2FnZVxuXG4gICAgY29uc3QgY2FsbEJhY2tVcmwgPSBwcm9jZXNzLmVudi5DQUxMQkFDS19VUkwgfHwgKCgpID0+IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBjYWxsYmFjayB1cmwgc3VwcGxpZWQnKVxuICAgIH0pKClcbiAgICBjb25zdCBjb25uZWN0aW9uVGFibGUgPSBwcm9jZXNzLmVudi5DT05ORUNUSU9OX1RBQkxFX05BTUUgfHwgKCgpID0+IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBjb25uZWN0aW9uIHRhYmxlIG5hbWUgc3VwcGxpZWQnKVxuICAgIH0pKClcbiAgICBjb25zdCBtZXNzYWdlc1RhYmxlID0gcHJvY2Vzcy5lbnYuTUVTU0FHRVNfVEFCTEVfTkFNRSB8fCAoKCkgPT4ge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIG1lc3NhZ2VzIHRhYmxlIG5hbWUgc3VwcGxpZWQnKVxuICAgIH0pKClcblxuXG4gICAgY29uc3QgY2FsbGJhY2tBUEkgPSBuZXcgQXBpR2F0ZXdheU1hbmFnZW1lbnRBcGkoe1xuICAgICAgICBhcGlWZXJzaW9uOiAnMjAxOC0xMS0yOScsIGVuZHBvaW50OiBjYWxsQmFja1VybFxuICAgIH0pO1xuXG4gICAgY29uc3QgZG9jdW1lbnRDbGllbnQgPSBuZXcgRHluYW1vREIuRG9jdW1lbnRDbGllbnQoKTtcbiAgICBjb25zdCBzZW50QXQgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgbGV0IGlkID0gcmFuZG9tVVVJRCgpO1xuICAgIGF3YWl0IGRvY3VtZW50Q2xpZW50LnB1dCh7XG4gICAgICAgIFRhYmxlTmFtZTogbWVzc2FnZXNUYWJsZSwgSXRlbToge1xuICAgICAgICAgICAgaWQsIHNlbnRBdCwgZnJvbTogbWVzc2FnZVByb3BzLmZyb20sIHRvOiBtZXNzYWdlUHJvcHMudG8sIG1lc3NhZ2U6IGluY29taW5nTWVzc2FnZVxuICAgICAgICB9IGFzIFN0b3JlZE1lc3NhZ2VQcm9wc1xuICAgIH0pLnByb21pc2UoKVxuXG4gICAgaWYgKG1lc3NhZ2VQcm9wcy50byA9PT0gJ2FsbCcpIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHNlbmRUb0FsbCgpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHNlbmRUb09uZSgpXG4gICAgfVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gc2VuZFRvQWxsKCk6IFByb21pc2U8QVBJR2F0ZXdheVByb3h5UmVzdWx0VjI+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ1F1ZXJ5aW5nIGNvbm5lY3Rpb24gaWRzJyk7XG4gICAgICAgIGNvbnN0IGNvbm5lY3RlZENsaWVudElkcyA9IChhd2FpdCBzY2FuQ29tcGxldGUoeyBUYWJsZU5hbWU6IGNvbm5lY3Rpb25UYWJsZSB9KSkubWFwKChpdGVtOiBBdHRyaWJ1dGVNYXApID0+IChpdGVtIGFzIENvbm5lY3Rpb25UYWJsZUl0ZW0pLmNvbm5lY3Rpb25JZCk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdDb25uZWN0aW9uIElkczogJyArIGNvbm5lY3RlZENsaWVudElkcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdQb3N0aW5nIHRvIGNvbm5lY3Rpb25zJyk7XG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKGNvbm5lY3RlZENsaWVudElkcy5tYXAoY29ubmVjdGlvbklkID0+IGNhbGxiYWNrQVBJLnBvc3RUb0Nvbm5lY3Rpb24oe1xuICAgICAgICAgICAgQ29ubmVjdGlvbklkOiBjb25uZWN0aW9uSWQsIERhdGE6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlVHlwZTogJ01FU1NBR0UnLCBtZXNzYWdlUHJvcHM6IHsgZnJvbTogbWVzc2FnZVByb3BzLmZyb20sIHRvOiBtZXNzYWdlUHJvcHMudG8sIG1lc3NhZ2U6IGluY29taW5nTWVzc2FnZSwgc2VudEF0LCBpZCB9XG4gICAgICAgICAgICB9IGFzIFJlY2lldmVNZXNzYWdlKVxuICAgICAgICB9KS5wcm9taXNlKCkpKTtcbiAgICAgICAgY29uc29sZS5sb2coJ1Bvc3RlZCB0byBjb25uZWN0aW9ucycpO1xuICAgICAgICByZXR1cm4geyBzdGF0dXNDb2RlOiAyMDAgfTtcbiAgICB9XG5cbiAgICBhc3luYyBmdW5jdGlvbiBzZW5kVG9PbmUoKTogUHJvbWlzZTxBUElHYXRld2F5UHJveHlSZXN1bHRWMj4ge1xuICAgICAgICBjb25zb2xlLmxvZygnUXVlcnlpbmcgY29ubmVjdGlvbiBpZCBmb3IgbmFtZSAnICsgbWVzc2FnZVByb3BzLnRvKTtcblxuICAgICAgICBjb25zdCBpdGVtcyA9IChhd2FpdCBkb2N1bWVudENsaWVudFxuICAgICAgICAgICAgLnF1ZXJ5KHtcbiAgICAgICAgICAgICAgICBUYWJsZU5hbWU6IGNvbm5lY3Rpb25UYWJsZSxcbiAgICAgICAgICAgICAgICBJbmRleE5hbWU6ICdOYW1lSW5kZXgnLFxuICAgICAgICAgICAgICAgIEtleUNvbmRpdGlvbkV4cHJlc3Npb246ICcjbiA9IDp0JyxcbiAgICAgICAgICAgICAgICBFeHByZXNzaW9uQXR0cmlidXRlTmFtZXM6IHsgJyNuJzogJ25hbWUnIH0sXG4gICAgICAgICAgICAgICAgRXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlczogeyAnOnQnOiBtZXNzYWdlUHJvcHMudG8gfVxuICAgICAgICAgICAgfSkucHJvbWlzZSgpKS5JdGVtcztcblxuICAgICAgICBpZiAoaXRlbXMgPT09IHVuZGVmaW5lZCB8fCBpdGVtcy5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvci4gSXRlbXMgcmV0cmlldmVkIHdhcyAnICsgaXRlbXMpXG4gICAgICAgICAgICByZXR1cm4geyBzdGF0dXNDb2RlOiA1MDAsIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgZXJyb3I6ICdDb3VsZCBub3QgbWF0Y2ggY29ubmVjdGlvbklEIHRvIG5hbWUnIH0pIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZWNpcGllbnRDb25uZWN0aW9uSWQgPSAoaXRlbXNbMF0gYXMgQ29ubmVjdGlvblRhYmxlSXRlbSkuY29ubmVjdGlvbklkXG4gICAgICAgIGNvbnNvbGUubG9nKCdSZWNpcGllbnQgY29ubmVjdGlvbiBJZDogJyArIHJlY2lwaWVudENvbm5lY3Rpb25JZCk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdQb3N0aW5nIHRvIGNvbm5lY3Rpb24nKTtcbiAgICAgICAgYXdhaXQgY2FsbGJhY2tBUEkucG9zdFRvQ29ubmVjdGlvbih7XG4gICAgICAgICAgICBDb25uZWN0aW9uSWQ6IHJlY2lwaWVudENvbm5lY3Rpb25JZCwgRGF0YTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VUeXBlOiAnTUVTU0FHRScsIG1lc3NhZ2VQcm9wczogeyBmcm9tOiBtZXNzYWdlUHJvcHMuZnJvbSwgdG86IG1lc3NhZ2VQcm9wcy50bywgbWVzc2FnZTogaW5jb21pbmdNZXNzYWdlLCBzZW50QXQsIGlkIH1cbiAgICAgICAgICAgIH0gYXMgUmVjaWV2ZU1lc3NhZ2UpXG4gICAgICAgIH0pLnByb21pc2UoKVxuXG4gICAgICAgIGNvbnNvbGUubG9nKCdQb3N0ZWQgdG8gY29ubmVjdGlvbnMnKTtcbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzQ29kZTogMjAwIH07XG4gICAgfVxufSJdfQ==