import { ApiMapping, DomainName, WebSocketApi, WebSocketStage } from "@aws-cdk/aws-apigatewayv2-alpha";
import { WebSocketLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { aws_route53 as route53 } from "aws-cdk-lib";
import { ICertificate } from "aws-cdk-lib/aws-certificatemanager";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { IHostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import * as targets from "aws-cdk-lib/aws-route53-targets";
import { Construct } from "constructs";

export class WSApiConstruct extends Construct {
    constructor(scope: Construct, id: string, props: {
        connectionTable: Table,
        messagesTable: Table,
        hostedZone: IHostedZone,
        certificate: ICertificate
    }) {
        super(scope, id)


        const connectionTableName = props.connectionTable.tableName;
        const messagesTableName = props.messagesTable.tableName;
        const messageHandler = new NodejsFunction(this, 'message-handler', { environment: { CONNECTION_TABLE_NAME: connectionTableName, MESSAGES_TABLE_NAME: messagesTableName }, logRetention: RetentionDays.ONE_MONTH })
        const connectHandler = new NodejsFunction(this, 'connect-handler', { environment: { CONNECTION_TABLE_NAME: connectionTableName }, logRetention: RetentionDays.ONE_MONTH })
        const disconnectHandler = new NodejsFunction(this, 'disconnect-handler', { environment: { CONNECTION_TABLE_NAME: connectionTableName }, logRetention: RetentionDays.ONE_MONTH })
        const defaultHandler = new NodejsFunction(this, 'default-handler', { logRetention: RetentionDays.ONE_MONTH })
        props.connectionTable.grantReadWriteData(connectHandler)
        props.connectionTable.grantReadWriteData(disconnectHandler)
        props.connectionTable.grantReadData(messageHandler)
        props.messagesTable.grantWriteData(messageHandler)

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
            throttle: {
                rateLimit: 10,
                burstLimit: 20
            }
        });

        messageHandler.addEnvironment('CALLBACK_URL', stage.callbackUrl)

        const recordName = 'chat-ws-api.mloesch.it';
        const domainName = new DomainName(this, 'DomainName', { domainName: recordName, certificate: props.certificate });

        new ApiMapping(this, 'Mapping', { api: webSocketApi, domainName, stage })
        new route53.ARecord(this, 'Arecord', { target: RecordTarget.fromAlias(new targets.ApiGatewayv2DomainProperties(domainName.regionalDomainName, domainName.regionalHostedZoneId)), zone: props.hostedZone, recordName })
    }
}