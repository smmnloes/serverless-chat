import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb"
import { Construct } from "constructs"

export class DynamoTablesConstruct extends Construct {
    readonly connectionTable: Table
    readonly messagesTable: Table

    constructor(scope: Construct, id: string) {
        super(scope, id)
        this.connectionTable = new Table(this, 'ConnectionTable', {
            tableName: 'Connections',
            partitionKey: {
                name: 'connectionId',
                type: AttributeType.STRING
            },
            billingMode: BillingMode.PAY_PER_REQUEST
        })

        this.connectionTable.addGlobalSecondaryIndex({
            indexName: 'NameIndex',
            partitionKey: { name: 'name', type: AttributeType.STRING }
        })
        
        this.messagesTable = new Table(this, 'MessagesTable', {
            tableName: 'Messages',
            partitionKey: {
                name: 'id',
                type: AttributeType.STRING
            },
            billingMode: BillingMode.PAY_PER_REQUEST
        })
    }
}