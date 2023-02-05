#!/usr/bin/env node
import * as dotenv from 'dotenv'
import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from '../lib/stacks/pipeline-stack';

dotenv.config()

const app = new cdk.App();
new PipelineStack(app, 'PipelineStack', {
  env: {
    account: process.env.ACCOUNT,
    region: process.env.REGION
  },
});
