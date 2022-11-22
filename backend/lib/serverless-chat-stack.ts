import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {DomainConstruct} from './api/domain/domain-construct';
import {RestApiConstruct} from './api/rest-api/rest-api-construct';
import {WSApiConstruct} from './api/ws-api/ws-api-construct';
import {DynamoTablesConstruct} from './dynamo/dynamo-tables';
import {DistributionConstruct} from "./distribution/distribution";


export class ServerlessChatStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        const dynamoTablesConstruct = new DynamoTablesConstruct(this, 'DynamoTables')
        const domainConstruct = new DomainConstruct(this, 'Domain')
        new WSApiConstruct(this, 'WSApi', {
            connectionTable: dynamoTablesConstruct.connectionTable,
            messagesTable: dynamoTablesConstruct.messagesTable,
            hostedZone: domainConstruct.hostedZone,
            certificate: domainConstruct.euCertificate,
            siteDomain: domainConstruct.siteDomain
        })
        new RestApiConstruct(this, 'RestApi', {
            certificate: domainConstruct.euCertificate,
            hostedZone: domainConstruct.hostedZone,
            siteDomain: domainConstruct.siteDomain,
            connectionTable: dynamoTablesConstruct.connectionTable,
            messagesTable: dynamoTablesConstruct.messagesTable
        })
        new DistributionConstruct(this, 'Distribution', {
            siteDomain: domainConstruct.siteDomain,
            zone: domainConstruct.hostedZone,
            certificate: domainConstruct.usCertificate
        })
    }
}
