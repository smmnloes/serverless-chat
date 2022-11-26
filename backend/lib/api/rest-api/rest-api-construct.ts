import {Cors, LambdaIntegration, RestApi} from "aws-cdk-lib/aws-apigateway";
import {ICertificate} from "aws-cdk-lib/aws-certificatemanager";
import {Table} from "aws-cdk-lib/aws-dynamodb";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {RetentionDays} from "aws-cdk-lib/aws-logs";
import {ARecord, IHostedZone, RecordTarget} from "aws-cdk-lib/aws-route53";
import * as targets from "aws-cdk-lib/aws-route53-targets";
import {Construct} from "constructs";

export class RestApiConstruct extends Construct {
    constructor(scope: Construct, id: string, props: {
        certificate: ICertificate, hostedZone: IHostedZone, siteDomain: string, connectionTable: Table, messagesTable: Table
    }) {
        super(scope, id)

        const chatRestApiDomainName = `chat-rest-api.${props.siteDomain}`;
        const restApi = new RestApi(this, 'RestApi', {
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS, allowMethods: Cors.ALL_METHODS
            }
        })
        restApi.addDomainName('DomainName', {
            certificate: props.certificate, domainName: chatRestApiDomainName
        })
        new ARecord(this, 'Arecord', {
            target: RecordTarget.fromAlias(new targets.ApiGateway(restApi)),
            zone: props.hostedZone,
            recordName: chatRestApiDomainName
        })

        const getAllConnectedUsersHandler = new NodejsFunction(this, 'get-connected-users-handler', {
            environment: {CONNECTION_TABLE_NAME: props.connectionTable.tableName}, logRetention: RetentionDays.ONE_MONTH
        })
        const getAllMessagesHandler = new NodejsFunction(this, 'get-all-messages-handler', {
            environment: {MESSAGES_TABLE_NAME: props.messagesTable.tableName}, logRetention: RetentionDays.ONE_MONTH
        })
        const getUsernameAvailableHandler = new NodejsFunction(this, 'get-username-available-handler', {
            environment: {CONNECTION_TABLE_NAME: props.connectionTable.tableName}, logRetention: RetentionDays.ONE_MONTH
        })
        props.connectionTable.grantReadData(getAllConnectedUsersHandler)
        props.connectionTable.grantReadData(getUsernameAvailableHandler)
        props.messagesTable.grantReadWriteData(getAllMessagesHandler)
        const userResource = restApi.root.addResource('user');
        userResource.addMethod('GET', new LambdaIntegration(getAllConnectedUsersHandler))
        userResource.addResource('{username}').addMethod('GET', new LambdaIntegration(getUsernameAvailableHandler))

        restApi.root.addResource('message').addMethod('GET', new LambdaIntegration(getAllMessagesHandler))
    }
}