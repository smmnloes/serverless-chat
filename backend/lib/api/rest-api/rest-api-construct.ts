import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { ICertificate } from "aws-cdk-lib/aws-certificatemanager";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { ARecord, IHostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import * as targets from "aws-cdk-lib/aws-route53-targets";
import { Construct } from "constructs";

export class RestApiConstruct extends Construct {
    constructor(scope: Construct, id: string, props: { certificate: ICertificate, hostedZone: IHostedZone, connectionTable: Table }) {
        super(scope, id)

        const recordName = 'chat-rest-api.mloesch.it';
        const restApi = new RestApi(this, 'RestApi')
        restApi.addDomainName('DomainName', {
            certificate: props.certificate,
            domainName: recordName
        })
        new ARecord(this, 'Arecord', { target: RecordTarget.fromAlias(new targets.ApiGateway(restApi)), zone: props.hostedZone, recordName })

        const getAllConnectedUsersHandler = new NodejsFunction(this, 'get-connected-users-handler', {environment: {CONNECTION_TABLE_NAME: props.connectionTable.tableName}})
        props.connectionTable.grantReadData(getAllConnectedUsersHandler)
        restApi.root.addResource('user').addMethod('GET', new LambdaIntegration(getAllConnectedUsersHandler))
    }
}