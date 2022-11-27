import { ICertificate } from "aws-cdk-lib/aws-certificatemanager";
import { IHostedZone } from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";
export declare class DomainConstruct extends Construct {
    readonly euCertificate: ICertificate;
    readonly usCertificate: ICertificate;
    readonly hostedZone: IHostedZone;
    readonly siteDomain: string;
    constructor(scope: Construct, id: string);
}
