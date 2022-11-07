onnecimport { WebSocketApi, WebSocketStage } from "@aws-cdk/aws-apigatewayv2-alpha";
import { WebSocketLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";


export class ApiConstruct extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id)

        const connectionTable = new Table(this, 'ConnectionTable', {
            tableName: 'Connections',
            partitionKey: {
                name: 'connectionId',
                type: AttributeType.STRING
            },
            billingMode: BillingMode.PAY_PER_REQUEST
        })

        const defaultHandler = new NodejsFunction(this, 'default-handler')
        const connectHandler = new NodejsFunction(this, 'connect-handler', { environment: { CONNECTION_TABLE: connectionTable.tableName } })
        const disconnectHandler = new NodejsFunction(this, 'disconnect-handler', { environment: { CONNECTION_TABLE: connectionTable.tableName } })
        connectionTable.grantWriteData(connectHandler)
        connectionTable.grantReadWriteData(disconnectHandler)

        const webSocketApi = new WebSocketApi(this, 'WebSocketApi', {
            defaultRouteOptions: { integration: new WebSocketLambdaIntegration('DefaultIntegration', defaultHandler) },
            connectRouteOptions: { integration: new WebSocketLambdaIntegration('ConnectIntegration', connectHandler) },
            disconnectRouteOptions: { integration: new WebSocketLambdaIntegration('DisconnectIntegration', disconnectHandler) }
        })

        const stage = new WebSocketStage(this, 'prod', {
            webSocketApi,
            stageName: 'prod',
            autoDeploy: true,
        });

        defaultHandler.addEnvironment('CALLBACK_URL', stage.callbackUrl)

        webSocketApi.grantManageConnections(defaultHandler)
    }
}