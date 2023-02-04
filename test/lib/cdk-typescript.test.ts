import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { CdkTypescriptStack } from '../../lib/cdk-typescript-stack';

describe('Lambda Function', () => {
  it('Should create handler correctly', () => {
    const sut = makeSut()
  
    sut.resourceCountIs('AWS::Lambda::Function', 1);
    sut.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'index.hello',
      Runtime: Runtime.NODEJS_14_X.name
    });
  });
})

describe('API Gateway', () => {
  it('Should create rest API correctly', () => {
    const sut = makeSut();
  
    sut.resourceCountIs('AWS::ApiGateway::Deployment', 1);
    sut.hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: 'Endpoint',
    });
    sut.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'ANY',
      Integration: { TimeoutInMillis: 2000 }
    });
  });
})

const makeSut = (): Template => {
  const app = new App();
  const stack = new CdkTypescriptStack(app, 'MyTestStack');
  return Template.fromStack(stack);
}