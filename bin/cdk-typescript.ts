#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkTypescriptStack } from '../lib/cdk-typescript-stack';

const app = new cdk.App();
new CdkTypescriptStack(app, 'CdkTypescriptStack');
