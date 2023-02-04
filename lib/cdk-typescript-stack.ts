import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import path = require('path');

export class CdkTypescriptStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const lambdaHandler = this.initializeLambda();
    this.initializeApiGateway(lambdaHandler);
  }

  private initializeLambda(): NodejsFunction {
    return new NodejsFunction(this, 'HelloHandler', {
      runtime: Runtime.NODEJS_14_X,
      entry: path.join(__dirname, `/../lambda/hello.ts`),
      handler: 'hello'
    });
  }

  private initializeApiGateway(handler: NodejsFunction): void {
    new LambdaRestApi(this, 'Endpoint', {
      handler,
      integrationOptions: {
        timeout: Duration.seconds(2)
      }
    })
  }
}
