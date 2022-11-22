import {Construct} from "constructs";
import {ARecord, IHostedZone, RecordTarget} from "aws-cdk-lib/aws-route53";
import {Bucket} from "aws-cdk-lib/aws-s3";
import {RemovalPolicy} from "aws-cdk-lib";
import {ICertificate} from "aws-cdk-lib/aws-certificatemanager";
import {Distribution, OriginAccessIdentity, PriceClass, ViewerProtocolPolicy} from "aws-cdk-lib/aws-cloudfront";
import {CloudFrontTarget} from "aws-cdk-lib/aws-route53-targets";
import {BucketDeployment, Source} from "aws-cdk-lib/aws-s3-deployment";
import path from 'path'
import {S3Origin} from "aws-cdk-lib/aws-cloudfront-origins";

export type DistributionProps = {
    zone: IHostedZone, certificate: ICertificate, siteDomain: string
}

export class DistributionConstruct extends Construct {

    constructor(scope: Construct, id: string, props: DistributionProps) {
        super(scope, id)
        // Content bucket
        let chatDomain = `chat.${props.siteDomain}`;
        const siteBucket = new Bucket(this, "SiteBucket", {
            bucketName: chatDomain,
            websiteIndexDocument: "index.html",
            publicReadAccess: true,
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true
        });


        const originAccessIdentity = new OriginAccessIdentity(this, 'SitebucketAccessIdentity')
        siteBucket.grantRead(originAccessIdentity)
        const distribution = new Distribution(this, 'SiteDistribution', {
            comment: 'Distribution for serverless chat app',
            enabled: true,
            priceClass: PriceClass.PRICE_CLASS_100,
            certificate: props.certificate,
            defaultBehavior: {
                origin: new S3Origin(siteBucket, {originAccessIdentity}),
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS
            },
            domainNames: [chatDomain]
        })

        new ARecord(this, "SiteAliasRecord", {
            recordName: chatDomain,
            target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
            zone: props.zone,
        });

        new BucketDeployment(this, 'SiteDeployment', {
            sources: [Source.asset(path.resolve(__dirname, '..', '..', '..', 'frontend', 'build'))],
            destinationBucket: siteBucket,
            distribution
        })
    }

}
