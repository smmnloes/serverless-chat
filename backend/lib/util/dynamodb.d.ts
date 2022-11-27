import { AWSError, DynamoDB } from "aws-sdk";
import { DocumentClient, ItemList } from "aws-sdk/clients/dynamodb";
/**
 * Wrapper around the dynamodb scan operation via DocumentClient that returns all results
 * @param params
 * @param callback
 * @returns
 */
export declare const scanComplete: (params: DocumentClient.ScanInput, callback?: ((err: AWSError, data: DocumentClient.ScanOutput) => void) | undefined) => Promise<DynamoDB.ItemList>;
