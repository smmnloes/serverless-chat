"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const dynamodb_1 = __importDefault(require("aws-sdk/clients/dynamodb"));
const handler = async (event) => {
    var _a;
    const connectionTable = process.env.CONNECTION_TABLE_NAME || (() => { throw new Error('No connection table name supplied'); })();
    console.log('Querying connection ids');
    const username = (_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.username;
    if (!username) {
        return createResponse(400, { message: 'No username given' });
    }
    const userNames = (await new dynamodb_1.default.DocumentClient().query({
        TableName: connectionTable,
        IndexName: 'NameIndex',
        KeyConditionExpression: '#n = :n',
        ExpressionAttributeNames: { '#n': 'name' },
        ExpressionAttributeValues: { ':n': username }
    }).promise()).Items;
    console.log('Retrieved usernames:' + JSON.stringify(userNames));
    if (userNames && userNames.length > 0) {
        return createResponse(409, { message: `Username ${username} is already connected` });
    }
    else {
        return createResponse(200);
    }
};
exports.handler = handler;
const createResponse = (statusCode, body) => {
    return {
        statusCode,
        body: JSON.stringify(body),
        headers: { 'Access-Control-Allow-Origin': '*' }
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzdC1hcGktY29uc3RydWN0LmdldC11c2VybmFtZS1hdmFpbGFibGUtaGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlc3QtYXBpLWNvbnN0cnVjdC5nZXQtdXNlcm5hbWUtYXZhaWxhYmxlLWhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0Esd0VBQWdEO0FBR3pDLE1BQU0sT0FBTyxHQUFHLEtBQUssRUFBRSxLQUEyQixFQUFvQyxFQUFFOztJQUMzRixNQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFBLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtJQUMvSCxPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDdkMsTUFBTSxRQUFRLEdBQUcsTUFBQSxLQUFLLENBQUMsY0FBYywwQ0FBRSxRQUFRLENBQUE7SUFDL0MsSUFBSSxDQUFDLFFBQVEsRUFBRTtRQUNYLE9BQU8sY0FBYyxDQUFDLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxDQUFFLENBQUE7S0FDaEU7SUFDRCxNQUFNLFNBQVMsR0FBRyxDQUFDLE1BQU0sSUFBSSxrQkFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDLEtBQUssQ0FBQztRQUN6RCxTQUFTLEVBQUUsZUFBZTtRQUMxQixTQUFTLEVBQUUsV0FBVztRQUN0QixzQkFBc0IsRUFBRSxTQUFTO1FBQ2pDLHdCQUF3QixFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtRQUMxQyx5QkFBeUIsRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7S0FDaEQsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO0lBQy9ELElBQUksU0FBUyxJQUFJLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ25DLE9BQU8sY0FBYyxDQUFDLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxZQUFZLFFBQVEsdUJBQXVCLEVBQUUsQ0FBQyxDQUFBO0tBQ3ZGO1NBQU07UUFDSCxPQUFPLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtLQUM3QjtBQUdMLENBQUMsQ0FBQTtBQXRCWSxRQUFBLE9BQU8sV0FzQm5CO0FBRUQsTUFBTSxjQUFjLEdBQUUsQ0FBQyxVQUFrQixFQUFFLElBQVUsRUFBMkIsRUFBRTtJQUM5RSxPQUFPO1FBQ0gsVUFBVTtRQUNWLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztRQUMxQixPQUFPLEVBQUUsRUFBQyw2QkFBNkIsRUFBRSxHQUFHLEVBQUM7S0FDaEQsQ0FBQTtBQUNMLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFQSUdhdGV3YXlQcm94eUV2ZW50LCBBUElHYXRld2F5UHJveHlSZXN1bHRWMiB9IGZyb20gJ2F3cy1sYW1iZGEnO1xuaW1wb3J0IER5bmFtb0RCIGZyb20gJ2F3cy1zZGsvY2xpZW50cy9keW5hbW9kYic7XG5cblxuZXhwb3J0IGNvbnN0IGhhbmRsZXIgPSBhc3luYyAoZXZlbnQ6IEFQSUdhdGV3YXlQcm94eUV2ZW50KTogUHJvbWlzZTxBUElHYXRld2F5UHJveHlSZXN1bHRWMj4gPT4ge1xuICAgIGNvbnN0IGNvbm5lY3Rpb25UYWJsZSA9IHByb2Nlc3MuZW52LkNPTk5FQ1RJT05fVEFCTEVfTkFNRSB8fCAoKCkgPT4geyB0aHJvdyBuZXcgRXJyb3IoJ05vIGNvbm5lY3Rpb24gdGFibGUgbmFtZSBzdXBwbGllZCcpIH0pKClcbiAgICBjb25zb2xlLmxvZygnUXVlcnlpbmcgY29ubmVjdGlvbiBpZHMnKTtcbiAgICBjb25zdCB1c2VybmFtZSA9IGV2ZW50LnBhdGhQYXJhbWV0ZXJzPy51c2VybmFtZVxuICAgIGlmICghdXNlcm5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZVJlc3BvbnNlKDQwMCwgeyBtZXNzYWdlOiAnTm8gdXNlcm5hbWUgZ2l2ZW4nIH0gKVxuICAgIH1cbiAgICBjb25zdCB1c2VyTmFtZXMgPSAoYXdhaXQgbmV3IER5bmFtb0RCLkRvY3VtZW50Q2xpZW50KCkucXVlcnkoe1xuICAgICAgICBUYWJsZU5hbWU6IGNvbm5lY3Rpb25UYWJsZSxcbiAgICAgICAgSW5kZXhOYW1lOiAnTmFtZUluZGV4JyxcbiAgICAgICAgS2V5Q29uZGl0aW9uRXhwcmVzc2lvbjogJyNuID0gOm4nLFxuICAgICAgICBFeHByZXNzaW9uQXR0cmlidXRlTmFtZXM6IHsgJyNuJzogJ25hbWUnIH0sXG4gICAgICAgIEV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXM6IHsgJzpuJzogdXNlcm5hbWUgfVxuICAgIH0pLnByb21pc2UoKSkuSXRlbXM7XG4gICAgY29uc29sZS5sb2coJ1JldHJpZXZlZCB1c2VybmFtZXM6JyArIEpTT04uc3RyaW5naWZ5KHVzZXJOYW1lcykpXG4gICAgaWYgKHVzZXJOYW1lcyAmJiB1c2VyTmFtZXMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gY3JlYXRlUmVzcG9uc2UoNDA5LCB7IG1lc3NhZ2U6IGBVc2VybmFtZSAke3VzZXJuYW1lfSBpcyBhbHJlYWR5IGNvbm5lY3RlZGAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY3JlYXRlUmVzcG9uc2UoMjAwKVxuICAgIH1cblxuXG59XG5cbmNvbnN0IGNyZWF0ZVJlc3BvbnNlPSAoc3RhdHVzQ29kZTogbnVtYmVyLCBib2R5PzogYW55KTogQVBJR2F0ZXdheVByb3h5UmVzdWx0VjIgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICAgIHN0YXR1c0NvZGUsXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGJvZHkpLFxuICAgICAgICBoZWFkZXJzOiB7J0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJ31cbiAgICB9XG59Il19