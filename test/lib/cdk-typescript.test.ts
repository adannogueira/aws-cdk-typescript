import { App } from 'aws-cdk-lib';
import { Capture, Template } from 'aws-cdk-lib/assertions';
import { CdkTypescriptStack } from '../../lib/stacks/cdk-typescript-stack';
import { aws } from '../awsResources';
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
    // Arrange & Act
    const sut = makeSut()

    // Assert
    const handlerCapture = new Capture();
    sut.resourceCountIs(aws.lambda.function, 2);
    sut.hasResourceProperties(aws.lambda.function, {
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
    // Arrange & Act
    const sut = makeSut()

    // Assert
    sut.resourceCountIs(aws.apiGateway.deployment, 1);
    sut.hasResourceProperties(aws.apiGateway.restApi, {
      Name: 'Endpoint',
    });
    sut.hasResourceProperties(aws.apiGateway.method, {
      HttpMethod: 'ANY',
      Integration: { TimeoutInMillis: 10000 }
    });
  });

  it('Should call TableViewer on class construction', () => {
    // Arrange & Act
    const sut = makeSut()

    // Assert
    const tableViewerSpy = jest.spyOn(TableViewer, 'TableViewer');
    expect(tableViewerSpy).toHaveBeenCalled();
  });
  
  it('Should add CfnOutput for both app endpoints', () => {
    // Arrange & Act
    jest.restoreAllMocks()
    const sut = makeSut()

    // Assert
    sut.findOutputs('GatewayUrl');
    sut.findOutputs('TableViewerUrl');
  });
});

const makeSut = (): Template => {
  const app = new App();
  const stack = new CdkTypescriptStack(app, 'MyTestStack');
  return Template.fromStack(stack);
};
