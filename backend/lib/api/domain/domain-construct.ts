import {
    Certificate, CertificateValidation, DnsValidatedCertificate, ICertificate
} from "aws-cdk-lib/aws-certificatemanager";
import {HostedZone, IHostedZone} from "aws-cdk-lib/aws-route53";
import {Construct} from "constructs";


export class DomainConstruct extends Construct {
    readonly euCertificate: ICertificate
    readonly usCertificate: ICertificate
    readonly hostedZone: IHostedZone
    readonly siteDomain: string

    constructor(scope: Construct, id: string) {
        super(scope, id)
        this.siteDomain = 'mloesch.it'
        this.hostedZone = HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
            hostedZoneId: 'Z06848993VY07KGYYTRUM', zoneName: this.siteDomain
        })
        this.euCertificate = new Certificate(this, 'mloeschItWildcardCertificateEU', {
            domainName: '*.mloesch.it', validation: CertificateValidation.fromDns(this.hostedZone)
        })
        this.usCertificate = new DnsValidatedCertificate(this, 'mloeschItWildcardCertificateUS', {
            domainName: `*.${this.siteDomain}`,
            hostedZone: this.hostedZone, // Cloudfront certificates must be in us-east-1
            region: 'us-east-1'
        })
    }
}