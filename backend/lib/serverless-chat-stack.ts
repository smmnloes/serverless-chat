import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DomainConstruct } from './api/domain/domain-construct';
import { RestApiConstruct } from './api/rest-api/rest-api-construct';
import { WSApiConstruct } from './api/ws-api/ws-api-construct';
import { DynamoTablesConstruct } from './dynamo/dynamo-tables';


export class ServerlessChatStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const dynamoTablesConstruct = new DynamoTablesConstruct(this, 'DynamoTables')
    const domainConstruct = new DomainConstruct(this, 'Domain')
    new WSApiConstruct(this, 'WSApi', { connectionTable: dynamoTablesConstruct.connectionTable, hostedZone: domainConstruct.hostedZone, certificate: domainConstruct.certificate })
    new RestApiConstruct(this, 'RestApi', {certificate: domainConstruct.certificate, hostedZone: domainConstruct.hostedZone, connectionTable: dynamoTablesConstruct.connectionTable})
  }
}
