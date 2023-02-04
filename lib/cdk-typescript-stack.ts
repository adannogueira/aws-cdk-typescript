import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import path = require('path');
import { HitCounterConstruct } from './hit-counter-construct';

export class CdkTypescriptStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const lambdaHandler = this.initializeLambda();
    const hitCounter = this.initializeHitCounter(lambdaHandler);
    this.initializeApiGateway(hitCounter.handler);
  }

  private initializeLambda(): NodejsFunction {
    return new NodejsFunction(this, 'HelloHandler', {
      runtime: Runtime.NODEJS_14_X,
      entry: path.join(__dirname, `/../lambda/hello.ts`),
      handler: 'hello'
    });
  }

  private initializeHitCounter(
    downstream: NodejsFunction
  ): HitCounterConstruct {
    const hitCounter = new HitCounterConstruct(this, 'HelloHitCounter', {
      downstream
    });
    return hitCounter;
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
