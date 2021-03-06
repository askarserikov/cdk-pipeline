#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkPipelineStack } from '../lib/cdk-pipeline-stack';
import { NoPipelineStack } from '../lib/no-pipeline';

const app = new cdk.App();
new CdkPipelineStack(app, 'CdkPipelineStack', {
  env: {
    account: '092614358952',
    region: 'eu-west-1'
}
});

new NoPipelineStack(app, 'NoPipelineStack');
