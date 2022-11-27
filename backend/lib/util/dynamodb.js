"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanComplete = void 0;
const aws_sdk_1 = require("aws-sdk");
/**
 * Wrapper around the dynamodb scan operation via DocumentClient that returns all results
 * @param params
 * @param callback
 * @returns
 */
const scanComplete = async (params, callback) => {
    let key;
    let lastResult;
    const allResultItems = [];
    const documentClient = new aws_sdk_1.DynamoDB.DocumentClient();
    do {
        lastResult = await documentClient.scan({ ...params, ExclusiveStartKey: key }, callback).promise();
        key = lastResult.LastEvaluatedKey;
        if (lastResult.Items) {
            allResultItems.push(...lastResult.Items);
        }
    } while (key);
    return allResultItems;
};
exports.scanComplete = scanComplete;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1vZGIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkeW5hbW9kYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBNEM7QUFFNUM7Ozs7O0dBS0c7QUFDSSxNQUFNLFlBQVksR0FBRyxLQUFLLEVBQUUsTUFBZ0MsRUFBRSxRQUFtRSxFQUE4QixFQUFFO0lBQ3BLLElBQUksR0FBRyxDQUFBO0lBQ1AsSUFBSSxVQUFVLENBQUE7SUFDZCxNQUFNLGNBQWMsR0FBYSxFQUFFLENBQUE7SUFDbkMsTUFBTSxjQUFjLEdBQUcsSUFBSSxrQkFBUSxDQUFDLGNBQWMsRUFBRSxDQUFBO0lBQ3BELEdBQUc7UUFDQyxVQUFVLEdBQUcsTUFBTSxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxNQUFNLEVBQUUsaUJBQWlCLEVBQUUsR0FBRyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUE7UUFDakcsR0FBRyxHQUFHLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQTtRQUNqQyxJQUFJLFVBQVUsQ0FBQyxLQUFLLEVBQUU7WUFDbkIsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtTQUMxQztLQUNKLFFBQVEsR0FBRyxFQUFDO0lBRWIsT0FBTyxjQUFjLENBQUE7QUFDekIsQ0FBQyxDQUFBO0FBZFksUUFBQSxZQUFZLGdCQWN4QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFXU0Vycm9yLCBEeW5hbW9EQiB9IGZyb20gXCJhd3Mtc2RrXCJcbmltcG9ydCB7IERvY3VtZW50Q2xpZW50LCBJdGVtTGlzdCB9IGZyb20gXCJhd3Mtc2RrL2NsaWVudHMvZHluYW1vZGJcIlxuLyoqXG4gKiBXcmFwcGVyIGFyb3VuZCB0aGUgZHluYW1vZGIgc2NhbiBvcGVyYXRpb24gdmlhIERvY3VtZW50Q2xpZW50IHRoYXQgcmV0dXJucyBhbGwgcmVzdWx0c1xuICogQHBhcmFtIHBhcmFtcyBcbiAqIEBwYXJhbSBjYWxsYmFjayBcbiAqIEByZXR1cm5zIFxuICovXG5leHBvcnQgY29uc3Qgc2NhbkNvbXBsZXRlID0gYXN5bmMgKHBhcmFtczogRG9jdW1lbnRDbGllbnQuU2NhbklucHV0LCBjYWxsYmFjaz86IChlcnI6IEFXU0Vycm9yLCBkYXRhOiBEb2N1bWVudENsaWVudC5TY2FuT3V0cHV0KSA9PiB2b2lkKTogUHJvbWlzZTxEeW5hbW9EQi5JdGVtTGlzdD4gPT4ge1xuICAgIGxldCBrZXlcbiAgICBsZXQgbGFzdFJlc3VsdFxuICAgIGNvbnN0IGFsbFJlc3VsdEl0ZW1zOiBJdGVtTGlzdCA9IFtdXG4gICAgY29uc3QgZG9jdW1lbnRDbGllbnQgPSBuZXcgRHluYW1vREIuRG9jdW1lbnRDbGllbnQoKVxuICAgIGRvIHtcbiAgICAgICAgbGFzdFJlc3VsdCA9IGF3YWl0IGRvY3VtZW50Q2xpZW50LnNjYW4oeyAuLi5wYXJhbXMsIEV4Y2x1c2l2ZVN0YXJ0S2V5OiBrZXkgfSwgY2FsbGJhY2spLnByb21pc2UoKVxuICAgICAgICBrZXkgPSBsYXN0UmVzdWx0Lkxhc3RFdmFsdWF0ZWRLZXlcbiAgICAgICAgaWYgKGxhc3RSZXN1bHQuSXRlbXMpIHtcbiAgICAgICAgICAgYWxsUmVzdWx0SXRlbXMucHVzaCguLi5sYXN0UmVzdWx0Lkl0ZW1zKVxuICAgICAgICB9XG4gICAgfSB3aGlsZSAoa2V5KVxuXG4gICAgcmV0dXJuIGFsbFJlc3VsdEl0ZW1zXG59Il19