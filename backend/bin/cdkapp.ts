#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {ServerlessChatStack} from '../lib/serverless-chat-stack';

const app = new cdk.App();
new ServerlessChatStack(app, 'ServerlessChat', {
    env: {
        account: '952838848580', region: 'eu-central-1'
    }
});