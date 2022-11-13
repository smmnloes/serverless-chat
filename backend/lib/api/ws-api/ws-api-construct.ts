import { ApiMapping, DomainName, WebSocketApi, WebSocketStage } from "@aws-cdk/aws-apigatewayv2-alpha";
import { WebSocketLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { aws_route53 as route53 } from "aws-cdk-lib";
import { aws_certificatemanager as certificatemanager } from "aws-cdk-lib";
import { CertificateValidation, ICertificate } from "aws-cdk-lib/aws-certificatemanager";
import { IHostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import * as targets from "aws-cdk-lib/aws-route53-targets"

export class WSApiConstruct extends Construct {
    constructor(scope: Construct, id: string, props: { connectionTable: Table, hostedZone: IHostedZone, certificate: ICertificate }) {
        super(scope, id)


        const connectionTableName = props.connectionTable.tableName;
        const messageHandler = new NodejsFunction(this, 'message-handler', { environment: { CONNECTION_TABLE: connectionTableName } })
        const connectHandler = new NodejsFunction(this, 'connect-handler', { environment: { CONNECTION_TABLE: connectionTableName } })
        const disconnectHandler = new NodejsFunction(this, 'disconnect-handler', { environment: { CONNECTION_TABLE: connectionTableName } })
        const defaultHandler = new NodejsFunction(this, 'default-handler')
        props.connectionTable.grantWriteData(connectHandler)
        props.connectionTable.grantReadWriteData(disconnectHandler)
        props.connectionTable.grantReadData(messageHandler)

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

        const domainName = new DomainName(this, 'DomainName', { domainName: 'chat-ws-api.mloesch.it', certificate: props.certificate });

        new ApiMapping(this, 'ApiMapping', { api: webSocketApi, domainName, stage })
        new route53.ARecord(this, 'apiArecord', { target: RecordTarget.fromAlias(new targets.ApiGatewayv2DomainProperties(domainName.regionalDomainName, domainName.regionalHostedZoneId)), zone: props.hostedZone, recordName: 'chat-ws-api.mloesch.it' })
    }
}