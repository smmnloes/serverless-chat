import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApiConstruct } from './api/api-construct';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class ServerlessChatStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const apiConstruct = new ApiConstruct(this, 'Api')
  }
}
