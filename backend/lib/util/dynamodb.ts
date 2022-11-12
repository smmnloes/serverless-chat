import { AWSError, DynamoDB } from "aws-sdk"
import { DocumentClient, ItemList } from "aws-sdk/clients/dynamodb"
/**
 * Wrapper around the dynamodb scan operation via DocumentClient that returns all results
 * @param params 
 * @param callback 
 * @returns 
 */
export const scanComplete = async (params: DocumentClient.ScanInput, callback?: (err: AWSError, data: DocumentClient.ScanOutput) => void): Promise<DynamoDB.ItemList> => {
    let key
    let lastResult
    const allResultItems: ItemList = []
    const documentClient = new DynamoDB.DocumentClient()
    do {
        lastResult = await documentClient.scan({ ...params, ExclusiveStartKey: key }, callback).promise()
        key = lastResult.LastEvaluatedKey
        if (lastResult.Items) {
           allResultItems.push(...lastResult.Items)
        }
    } while (key)

    return allResultItems
}