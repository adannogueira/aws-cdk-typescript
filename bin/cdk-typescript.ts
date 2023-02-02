#!/usr/bin/env node
import * as dotenv from 'dotenv'
import * as cdk from 'aws-cdk-lib';
import { CdkTypescriptStack } from '../lib/cdk-typescript-stack';

dotenv.config()

const app = new cdk.App();
new CdkTypescriptStack(app, 'CdkTypescriptStack', {
  env: {
    account: process.env.ACCOUNT,
    region: process.env.REGION
  },
});
