import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { TableViewer } from 'cdk-dynamo-table-viewer';
import { Construct } from 'constructs';
import { join } from 'path';
import { HitCounterConstruct } from '../constructs/hit-counter-construct';

export class CdkTypescriptStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const lambdaHandler = this.initializeLambda();
    const hitCounter = this.initializeHitCounter(lambdaHandler);
    this.initializeTableViewer(hitCounter.table);
    this.initializeApiGateway(hitCounter.handler);
  }

  private initializeLambda(): NodejsFunction {
    return new NodejsFunction(this, 'HelloHandler', {
      runtime: Runtime.NODEJS_14_X,
      entry: join(__dirname, `/../lambda/hello.ts`),
      handler: 'hello',
      timeout: Duration.seconds(4),
      memorySize: 128
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
        timeout: Duration.seconds(5)
      }
    });
  }

  private initializeTableViewer(table: Table): void {
    new TableViewer(this, 'ViewHitCounter', {
      title: 'Hello Hits',
      sortBy: '-hits',
      table
    });
  }
}
