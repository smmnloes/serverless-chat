import { ICertificate } from "aws-cdk-lib/aws-certificatemanager";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { IHostedZone } from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";
export declare class RestApiConstruct extends Construct {
    constructor(scope: Construct, id: string, props: {
        certificate: ICertificate;
        hostedZone: IHostedZone;
        siteDomain: string;
        connectionTable: Table;
        messagesTable: Table;
    });
}
