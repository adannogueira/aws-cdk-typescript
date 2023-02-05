import { App } from 'aws-cdk-lib';
import { Capture, Template } from 'aws-cdk-lib/assertions';
import { CdkTypescriptStack } from '../../lib/stacks/cdk-typescript-stack';
import * as TableViewer from 'cdk-dynamo-table-viewer';
jest.mock('cdk-dynamo-table-viewer', () => {
  return {
    TableViewer: jest.fn().mockImplementation(() => ({
      endpoint: 'any'
    }))
  }
});

describe('CdkStack', () => {
  it('Should create lambda handlers correctly', () => {
    const sut = makeSut()
    const handlerCapture = new Capture();
    sut.resourceCountIs('AWS::Lambda::Function', 2);
    sut.hasResourceProperties('AWS::Lambda::Function', {
      Handler: handlerCapture,
      Timeout: 10,
      MemorySize: 128
    });
    expect(handlerCapture._captured).toEqual([
      'index.hello',
      'index.hitCounter'
    ]);
  });

  it('Should create API Gateway correctly', () => {
    const sut = makeSut();
  
    sut.resourceCountIs('AWS::ApiGateway::Deployment', 1);
    sut.hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: 'Endpoint',
    });
    sut.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'ANY',
      Integration: { TimeoutInMillis: 10000 }
    });
  });

  it('Should call TableViewer on class construction', () => {
    makeSut();
    const tableViewerSpy = jest.spyOn(TableViewer, 'TableViewer');
    expect(tableViewerSpy).toHaveBeenCalled();
  });
  
  it('Should add CfnOutput for both app endpoints', () => {
    jest.restoreAllMocks()
    const sut = makeSut();
  
    sut.findOutputs('GatewayUrl');
    sut.findOutputs('TableViewerUrl');
  });
});

const makeSut = (): Template => {
  const app = new App();
  const stack = new CdkTypescriptStack(app, 'MyTestStack');
  return Template.fromStack(stack);
};
