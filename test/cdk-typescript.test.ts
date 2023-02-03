import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import * as CdkTypescript from '../lib/cdk-typescript-stack';

describe('Lambda Function', () => {
  it('Should create handler correctly', () => {
    const app = new cdk.App();
  
    const stack = new CdkTypescript.CdkTypescriptStack(app, 'MyTestStack');
    const template = Template.fromStack(stack);
  
    template.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'index.hello',
      Runtime: Runtime.NODEJS_14_X.name
    });
  });
})

describe('API Gateway', () => {
  it('Should create rest API correctly', () => {
    const app = new cdk.App();
  
    const stack = new CdkTypescript.CdkTypescriptStack(app, 'MyTestStack');
    const template = Template.fromStack(stack);
  
    template.resourceCountIs('AWS::ApiGateway::Deployment', 1);
    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: 'Endpoint',
    });
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'ANY',
      Integration: { TimeoutInMillis: 2000 }
    });
  });
})