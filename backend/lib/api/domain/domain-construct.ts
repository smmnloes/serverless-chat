import { Certificate, CertificateValidation, ICertificate } from "aws-cdk-lib/aws-certificatemanager";
import { HostedZone, IHostedZone } from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";


export class DomainConstruct extends Construct {
    readonly certificate: ICertificate
    readonly hostedZone: IHostedZone

    constructor(scope: Construct, id: string) {
        super(scope, id)

        this.hostedZone = HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
            hostedZoneId: 'Z06848993VY07KGYYTRUM',
            zoneName: 'mloesch.it'
        })
        this.certificate = new Certificate(this, 'mloeschItWildcardCertificate', { domainName: '*.mloesch.it', validation: CertificateValidation.fromDns(this.hostedZone) })
    }
}