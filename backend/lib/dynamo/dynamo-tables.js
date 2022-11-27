"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoTablesConstruct = void 0;
const aws_dynamodb_1 = require("aws-cdk-lib/aws-dynamodb");
const constructs_1 = require("constructs");
class DynamoTablesConstruct extends constructs_1.Construct {
    constructor(scope, id) {
        super(scope, id);
        this.connectionTable = new aws_dynamodb_1.Table(this, 'ConnectionTable', {
            tableName: 'Connections',
            partitionKey: {
                name: 'connectionId',
                type: aws_dynamodb_1.AttributeType.STRING
            },
            billingMode: aws_dynamodb_1.BillingMode.PAY_PER_REQUEST
        });
        this.connectionTable.addGlobalSecondaryIndex({
            indexName: 'NameIndex',
            partitionKey: { name: 'name', type: aws_dynamodb_1.AttributeType.STRING }
        });
        this.messagesTable = new aws_dynamodb_1.Table(this, 'MessagesTable', {
            tableName: 'Messages',
            partitionKey: {
                name: 'id',
                type: aws_dynamodb_1.AttributeType.STRING
            },
            billingMode: aws_dynamodb_1.BillingMode.PAY_PER_REQUEST
        });
    }
}
exports.DynamoTablesConstruct = DynamoTablesConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1vLXRhYmxlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImR5bmFtby10YWJsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkRBQTRFO0FBQzVFLDJDQUFzQztBQUV0QyxNQUFhLHFCQUFzQixTQUFRLHNCQUFTO0lBSWhELFlBQVksS0FBZ0IsRUFBRSxFQUFVO1FBQ3BDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFDaEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLG9CQUFLLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFO1lBQ3RELFNBQVMsRUFBRSxhQUFhO1lBQ3hCLFlBQVksRUFBRTtnQkFDVixJQUFJLEVBQUUsY0FBYztnQkFDcEIsSUFBSSxFQUFFLDRCQUFhLENBQUMsTUFBTTthQUM3QjtZQUNELFdBQVcsRUFBRSwwQkFBVyxDQUFDLGVBQWU7U0FDM0MsQ0FBQyxDQUFBO1FBRUYsSUFBSSxDQUFDLGVBQWUsQ0FBQyx1QkFBdUIsQ0FBQztZQUN6QyxTQUFTLEVBQUUsV0FBVztZQUN0QixZQUFZLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSw0QkFBYSxDQUFDLE1BQU0sRUFBRTtTQUM3RCxDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksb0JBQUssQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQ2xELFNBQVMsRUFBRSxVQUFVO1lBQ3JCLFlBQVksRUFBRTtnQkFDVixJQUFJLEVBQUUsSUFBSTtnQkFDVixJQUFJLEVBQUUsNEJBQWEsQ0FBQyxNQUFNO2FBQzdCO1lBQ0QsV0FBVyxFQUFFLDBCQUFXLENBQUMsZUFBZTtTQUMzQyxDQUFDLENBQUE7SUFDTixDQUFDO0NBQ0o7QUE3QkQsc0RBNkJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXR0cmlidXRlVHlwZSwgQmlsbGluZ01vZGUsIFRhYmxlIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1keW5hbW9kYlwiXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tIFwiY29uc3RydWN0c1wiXG5cbmV4cG9ydCBjbGFzcyBEeW5hbW9UYWJsZXNDb25zdHJ1Y3QgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICAgIHJlYWRvbmx5IGNvbm5lY3Rpb25UYWJsZTogVGFibGVcbiAgICByZWFkb25seSBtZXNzYWdlc1RhYmxlOiBUYWJsZVxuXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQpXG4gICAgICAgIHRoaXMuY29ubmVjdGlvblRhYmxlID0gbmV3IFRhYmxlKHRoaXMsICdDb25uZWN0aW9uVGFibGUnLCB7XG4gICAgICAgICAgICB0YWJsZU5hbWU6ICdDb25uZWN0aW9ucycsXG4gICAgICAgICAgICBwYXJ0aXRpb25LZXk6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnY29ubmVjdGlvbklkJyxcbiAgICAgICAgICAgICAgICB0eXBlOiBBdHRyaWJ1dGVUeXBlLlNUUklOR1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJpbGxpbmdNb2RlOiBCaWxsaW5nTW9kZS5QQVlfUEVSX1JFUVVFU1RcbiAgICAgICAgfSlcblxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25UYWJsZS5hZGRHbG9iYWxTZWNvbmRhcnlJbmRleCh7XG4gICAgICAgICAgICBpbmRleE5hbWU6ICdOYW1lSW5kZXgnLFxuICAgICAgICAgICAgcGFydGl0aW9uS2V5OiB7IG5hbWU6ICduYW1lJywgdHlwZTogQXR0cmlidXRlVHlwZS5TVFJJTkcgfVxuICAgICAgICB9KVxuICAgICAgICBcbiAgICAgICAgdGhpcy5tZXNzYWdlc1RhYmxlID0gbmV3IFRhYmxlKHRoaXMsICdNZXNzYWdlc1RhYmxlJywge1xuICAgICAgICAgICAgdGFibGVOYW1lOiAnTWVzc2FnZXMnLFxuICAgICAgICAgICAgcGFydGl0aW9uS2V5OiB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2lkJyxcbiAgICAgICAgICAgICAgICB0eXBlOiBBdHRyaWJ1dGVUeXBlLlNUUklOR1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJpbGxpbmdNb2RlOiBCaWxsaW5nTW9kZS5QQVlfUEVSX1JFUVVFU1RcbiAgICAgICAgfSlcbiAgICB9XG59Il19