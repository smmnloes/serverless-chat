import { Construct } from "constructs";
import { IHostedZone } from "aws-cdk-lib/aws-route53";
import { ICertificate } from "aws-cdk-lib/aws-certificatemanager";
export declare type DistributionConstructProps = {
    zone: IHostedZone;
    certificate: ICertificate;
    siteDomain: string;
};
export declare class DistributionConstruct extends Construct {
    constructor(scope: Construct, id: string, props: DistributionConstructProps);
}
