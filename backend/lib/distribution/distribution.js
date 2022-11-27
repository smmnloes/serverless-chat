"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistributionConstruct = void 0;
const constructs_1 = require("constructs");
const aws_route53_1 = require("aws-cdk-lib/aws-route53");
const aws_s3_1 = require("aws-cdk-lib/aws-s3");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_cloudfront_1 = require("aws-cdk-lib/aws-cloudfront");
const aws_route53_targets_1 = require("aws-cdk-lib/aws-route53-targets");
const aws_s3_deployment_1 = require("aws-cdk-lib/aws-s3-deployment");
const path_1 = __importDefault(require("path"));
const aws_cloudfront_origins_1 = require("aws-cdk-lib/aws-cloudfront-origins");
class DistributionConstruct extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        // Content bucket
        let chatDomain = `chat.${props.siteDomain}`;
        const siteBucket = new aws_s3_1.Bucket(this, "SiteBucket", {
            bucketName: chatDomain,
            publicReadAccess: false,
            blockPublicAccess: aws_s3_1.BlockPublicAccess.BLOCK_ALL,
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            autoDeleteObjects: true
        });
        const originAccessIdentity = new aws_cloudfront_1.OriginAccessIdentity(this, 'SitebucketAccessIdentity');
        siteBucket.grantRead(originAccessIdentity);
        const distribution = new aws_cloudfront_1.Distribution(this, 'SiteDistribution', {
            comment: 'Distribution for serverless chat app',
            enabled: true,
            priceClass: aws_cloudfront_1.PriceClass.PRICE_CLASS_100,
            defaultRootObject: 'index.html',
            certificate: props.certificate,
            errorResponses: [{
                    responseHttpStatus: 200, httpStatus: 403, responsePagePath: '/index.html'
                }, {
                    responseHttpStatus: 200, httpStatus: 404, responsePagePath: '/index.html'
                }],
            defaultBehavior: {
                origin: new aws_cloudfront_origins_1.S3Origin(siteBucket, { originAccessIdentity }),
                viewerProtocolPolicy: aws_cloudfront_1.ViewerProtocolPolicy.REDIRECT_TO_HTTPS
            },
            domainNames: [chatDomain]
        });
        new aws_route53_1.ARecord(this, "SiteAliasRecord", {
            recordName: chatDomain,
            target: aws_route53_1.RecordTarget.fromAlias(new aws_route53_targets_1.CloudFrontTarget(distribution)),
            zone: props.zone,
        });
        new aws_s3_deployment_1.BucketDeployment(this, 'SiteDeployment', {
            sources: [aws_s3_deployment_1.Source.asset(path_1.default.resolve(__dirname, '..', '..', '..', 'frontend', 'build'))],
            destinationBucket: siteBucket,
            distribution
        });
    }
}
exports.DistributionConstruct = DistributionConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzdHJpYnV0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlzdHJpYnV0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDJDQUFxQztBQUNyQyx5REFBMkU7QUFDM0UsK0NBQTZEO0FBQzdELDZDQUEwQztBQUUxQywrREFBZ0g7QUFDaEgseUVBQWlFO0FBQ2pFLHFFQUF1RTtBQUN2RSxnREFBdUI7QUFDdkIsK0VBQTREO0FBTTVELE1BQWEscUJBQXNCLFNBQVEsc0JBQVM7SUFFaEQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFpQztRQUN2RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBQ2hCLGlCQUFpQjtRQUNqQixJQUFJLFVBQVUsR0FBRyxRQUFRLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUM1QyxNQUFNLFVBQVUsR0FBRyxJQUFJLGVBQU0sQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQzlDLFVBQVUsRUFBRSxVQUFVO1lBQ3RCLGdCQUFnQixFQUFFLEtBQUs7WUFDdkIsaUJBQWlCLEVBQUUsMEJBQWlCLENBQUMsU0FBUztZQUM5QyxhQUFhLEVBQUUsMkJBQWEsQ0FBQyxPQUFPO1lBQ3BDLGlCQUFpQixFQUFFLElBQUk7U0FDMUIsQ0FBQyxDQUFDO1FBR0gsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLHFDQUFvQixDQUFDLElBQUksRUFBRSwwQkFBMEIsQ0FBQyxDQUFBO1FBQ3ZGLFVBQVUsQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtRQUMxQyxNQUFNLFlBQVksR0FBRyxJQUFJLDZCQUFZLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1lBQzVELE9BQU8sRUFBRSxzQ0FBc0M7WUFDL0MsT0FBTyxFQUFFLElBQUk7WUFDYixVQUFVLEVBQUUsMkJBQVUsQ0FBQyxlQUFlO1lBQ3RDLGlCQUFpQixFQUFFLFlBQVk7WUFDL0IsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO1lBQzlCLGNBQWMsRUFBRSxDQUFDO29CQUNiLGtCQUFrQixFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLGdCQUFnQixFQUFFLGFBQWE7aUJBQzVFLEVBQUU7b0JBQ0Msa0JBQWtCLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsZ0JBQWdCLEVBQUUsYUFBYTtpQkFDNUUsQ0FBQztZQUNGLGVBQWUsRUFBRTtnQkFDYixNQUFNLEVBQUUsSUFBSSxpQ0FBUSxDQUFDLFVBQVUsRUFBRSxFQUFDLG9CQUFvQixFQUFDLENBQUM7Z0JBQ3hELG9CQUFvQixFQUFFLHFDQUFvQixDQUFDLGlCQUFpQjthQUMvRDtZQUNELFdBQVcsRUFBRSxDQUFDLFVBQVUsQ0FBQztTQUM1QixDQUFDLENBQUE7UUFFRixJQUFJLHFCQUFPLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFO1lBQ2pDLFVBQVUsRUFBRSxVQUFVO1lBQ3RCLE1BQU0sRUFBRSwwQkFBWSxDQUFDLFNBQVMsQ0FBQyxJQUFJLHNDQUFnQixDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ2xFLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtTQUNuQixDQUFDLENBQUM7UUFFSCxJQUFJLG9DQUFnQixDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtZQUN6QyxPQUFPLEVBQUUsQ0FBQywwQkFBTSxDQUFDLEtBQUssQ0FBQyxjQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUN2RixpQkFBaUIsRUFBRSxVQUFVO1lBQzdCLFlBQVk7U0FDZixDQUFDLENBQUE7SUFDTixDQUFDO0NBRUo7QUFoREQsc0RBZ0RDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb25zdHJ1Y3R9IGZyb20gXCJjb25zdHJ1Y3RzXCI7XG5pbXBvcnQge0FSZWNvcmQsIElIb3N0ZWRab25lLCBSZWNvcmRUYXJnZXR9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3Mtcm91dGU1M1wiO1xuaW1wb3J0IHtCbG9ja1B1YmxpY0FjY2VzcywgQnVja2V0fSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLXMzXCI7XG5pbXBvcnQge1JlbW92YWxQb2xpY3l9IGZyb20gXCJhd3MtY2RrLWxpYlwiO1xuaW1wb3J0IHtJQ2VydGlmaWNhdGV9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtY2VydGlmaWNhdGVtYW5hZ2VyXCI7XG5pbXBvcnQge0Rpc3RyaWJ1dGlvbiwgT3JpZ2luQWNjZXNzSWRlbnRpdHksIFByaWNlQ2xhc3MsIFZpZXdlclByb3RvY29sUG9saWN5fSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWNsb3VkZnJvbnRcIjtcbmltcG9ydCB7Q2xvdWRGcm9udFRhcmdldH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1yb3V0ZTUzLXRhcmdldHNcIjtcbmltcG9ydCB7QnVja2V0RGVwbG95bWVudCwgU291cmNlfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLXMzLWRlcGxveW1lbnRcIjtcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQge1MzT3JpZ2lufSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWNsb3VkZnJvbnQtb3JpZ2luc1wiO1xuXG5leHBvcnQgdHlwZSBEaXN0cmlidXRpb25Db25zdHJ1Y3RQcm9wcyA9IHtcbiAgICB6b25lOiBJSG9zdGVkWm9uZSwgY2VydGlmaWNhdGU6IElDZXJ0aWZpY2F0ZSwgc2l0ZURvbWFpbjogc3RyaW5nXG59XG5cbmV4cG9ydCBjbGFzcyBEaXN0cmlidXRpb25Db25zdHJ1Y3QgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IERpc3RyaWJ1dGlvbkNvbnN0cnVjdFByb3BzKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZClcbiAgICAgICAgLy8gQ29udGVudCBidWNrZXRcbiAgICAgICAgbGV0IGNoYXREb21haW4gPSBgY2hhdC4ke3Byb3BzLnNpdGVEb21haW59YDtcbiAgICAgICAgY29uc3Qgc2l0ZUJ1Y2tldCA9IG5ldyBCdWNrZXQodGhpcywgXCJTaXRlQnVja2V0XCIsIHtcbiAgICAgICAgICAgIGJ1Y2tldE5hbWU6IGNoYXREb21haW4sXG4gICAgICAgICAgICBwdWJsaWNSZWFkQWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgIGJsb2NrUHVibGljQWNjZXNzOiBCbG9ja1B1YmxpY0FjY2Vzcy5CTE9DS19BTEwsXG4gICAgICAgICAgICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICAgICAgICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZVxuICAgICAgICB9KTtcblxuXG4gICAgICAgIGNvbnN0IG9yaWdpbkFjY2Vzc0lkZW50aXR5ID0gbmV3IE9yaWdpbkFjY2Vzc0lkZW50aXR5KHRoaXMsICdTaXRlYnVja2V0QWNjZXNzSWRlbnRpdHknKVxuICAgICAgICBzaXRlQnVja2V0LmdyYW50UmVhZChvcmlnaW5BY2Nlc3NJZGVudGl0eSlcbiAgICAgICAgY29uc3QgZGlzdHJpYnV0aW9uID0gbmV3IERpc3RyaWJ1dGlvbih0aGlzLCAnU2l0ZURpc3RyaWJ1dGlvbicsIHtcbiAgICAgICAgICAgIGNvbW1lbnQ6ICdEaXN0cmlidXRpb24gZm9yIHNlcnZlcmxlc3MgY2hhdCBhcHAnLFxuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIHByaWNlQ2xhc3M6IFByaWNlQ2xhc3MuUFJJQ0VfQ0xBU1NfMTAwLFxuICAgICAgICAgICAgZGVmYXVsdFJvb3RPYmplY3Q6ICdpbmRleC5odG1sJyxcbiAgICAgICAgICAgIGNlcnRpZmljYXRlOiBwcm9wcy5jZXJ0aWZpY2F0ZSxcbiAgICAgICAgICAgIGVycm9yUmVzcG9uc2VzOiBbe1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlSHR0cFN0YXR1czogMjAwLCBodHRwU3RhdHVzOiA0MDMsIHJlc3BvbnNlUGFnZVBhdGg6ICcvaW5kZXguaHRtbCdcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICByZXNwb25zZUh0dHBTdGF0dXM6IDIwMCwgaHR0cFN0YXR1czogNDA0LCByZXNwb25zZVBhZ2VQYXRoOiAnL2luZGV4Lmh0bWwnXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICAgIGRlZmF1bHRCZWhhdmlvcjoge1xuICAgICAgICAgICAgICAgIG9yaWdpbjogbmV3IFMzT3JpZ2luKHNpdGVCdWNrZXQsIHtvcmlnaW5BY2Nlc3NJZGVudGl0eX0pLFxuICAgICAgICAgICAgICAgIHZpZXdlclByb3RvY29sUG9saWN5OiBWaWV3ZXJQcm90b2NvbFBvbGljeS5SRURJUkVDVF9UT19IVFRQU1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRvbWFpbk5hbWVzOiBbY2hhdERvbWFpbl1cbiAgICAgICAgfSlcblxuICAgICAgICBuZXcgQVJlY29yZCh0aGlzLCBcIlNpdGVBbGlhc1JlY29yZFwiLCB7XG4gICAgICAgICAgICByZWNvcmROYW1lOiBjaGF0RG9tYWluLFxuICAgICAgICAgICAgdGFyZ2V0OiBSZWNvcmRUYXJnZXQuZnJvbUFsaWFzKG5ldyBDbG91ZEZyb250VGFyZ2V0KGRpc3RyaWJ1dGlvbikpLFxuICAgICAgICAgICAgem9uZTogcHJvcHMuem9uZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbmV3IEJ1Y2tldERlcGxveW1lbnQodGhpcywgJ1NpdGVEZXBsb3ltZW50Jywge1xuICAgICAgICAgICAgc291cmNlczogW1NvdXJjZS5hc3NldChwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4nLCAnLi4nLCAnLi4nLCAnZnJvbnRlbmQnLCAnYnVpbGQnKSldLFxuICAgICAgICAgICAgZGVzdGluYXRpb25CdWNrZXQ6IHNpdGVCdWNrZXQsXG4gICAgICAgICAgICBkaXN0cmlidXRpb25cbiAgICAgICAgfSlcbiAgICB9XG5cbn1cbiJdfQ==