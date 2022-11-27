import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
export declare class DynamoTablesConstruct extends Construct {
    readonly connectionTable: Table;
    readonly messagesTable: Table;
    constructor(scope: Construct, id: string);
}
