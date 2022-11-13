import { ApiMapping, DomainName, WebSocketApi, WebSocketStage } from "@aws-cdk/aws-apigatewayv2-alpha";
import { WebSocketLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { aws_route53 as route53 } from "aws-cdk-lib";
import { aws_certificatemanager as certificatemanager } from "aws-cdk-lib";
import { CertificateValidation } from "aws-cdk-lib/aws-certificatemanager";
import { RecordTarget } from "aws-cdk-lib/aws-route53";
import * as targets from "aws-cdk-lib/aws-route53-targets"

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

        connectionTable.addGlobalSecondaryIndex({
            indexName: 'NameIndex',
            partitionKey: { name: 'name', type: AttributeType.STRING }
        })

        const messageHandler = new NodejsFunction(this, 'message-handler', { environment: { CONNECTION_TABLE: connectionTable.tableName } })
        const connectHandler = new NodejsFunction(this, 'connect-handler', { environment: { CONNECTION_TABLE: connectionTable.tableName } })
        const disconnectHandler = new NodejsFunction(this, 'disconnect-handler', { environment: { CONNECTION_TABLE: connectionTable.tableName } })
        const defaultHandler = new NodejsFunction(this, 'default-handler')
        connectionTable.grantWriteData(connectHandler)
        connectionTable.grantReadWriteData(disconnectHandler)
        connectionTable.grantReadData(messageHandler)

        const webSocketApi = new WebSocketApi(this, 'WebSocketApi', {
            routeSelectionExpression: '$request.body.action',
            defaultRouteOptions: { integration: new WebSocketLambdaIntegration('DefaultIntegration', defaultHandler) },
            connectRouteOptions: { integration: new WebSocketLambdaIntegration('ConnectIntegration', connectHandler) },
            disconnectRouteOptions: { integration: new WebSocketLambdaIntegration('DisconnectIntegration', disconnectHandler) }
        })
        webSocketApi.addRoute('message', { integration: new WebSocketLambdaIntegration('MessageIntegration', messageHandler) })


        webSocketApi.grantManageConnections(messageHandler)
        
        const stage = new WebSocketStage(this, 'prod', {
            webSocketApi,
            stageName: 'prod',
            autoDeploy: true,
        });
        
        messageHandler.addEnvironment('CALLBACK_URL', stage.callbackUrl)
       
        // Domain Stuff

        const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
            hostedZoneId: 'Z06848993VY07KGYYTRUM',
            zoneName: 'mloesch.it'
        })
        const certificate = new certificatemanager.Certificate(this, 'mloeschItWildcardCertificate', { domainName: '*.mloesch.it', validation: CertificateValidation.fromDns(hostedZone) })

        const domainName = new DomainName(this, 'DomainName', { domainName: 'chat-ws-api.mloesch.it', certificate });

       new ApiMapping(this, 'ApiMapping', { api: webSocketApi, domainName, stage })
       new route53.ARecord(this, 'apiArecord', { target: RecordTarget.fromAlias(new targets.ApiGatewayv2DomainProperties(domainName.regionalDomainName, domainName.regionalHostedZoneId)), zone: hostedZone, recordName: 'chat-ws-api.mloesch.it' })
 

    }
}