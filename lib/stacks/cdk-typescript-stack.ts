import { CfnOutput, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { TableViewer } from 'cdk-dynamo-table-viewer';
import { Construct } from 'constructs';
import { join } from 'path';
import { HitCounterConstruct } from '../constructs/hit-counter-construct';

export class CdkTypescriptStack extends Stack {
  public readonly hitCounterViewerUrl: CfnOutput;
  public readonly hitCounterEndpoint: CfnOutput;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const lambdaHandler = this.initializeLambda();
    const hitCounter = this.initializeHitCounter(lambdaHandler);
    this.hitCounterViewerUrl = this.initializeTableViewer(hitCounter.table);
    this.hitCounterEndpoint = this.initializeApiGateway(hitCounter.handler);
  }

  private initializeLambda(): NodejsFunction {
    return new NodejsFunction(this, 'HelloHandler', {
      runtime: Runtime.NODEJS_14_X,
      entry: join(__dirname, `/../../lambda/hello.ts`),
      handler: 'hello',
      timeout: Duration.seconds(10),
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

  private initializeApiGateway(handler: NodejsFunction): CfnOutput {
    const gateway = new LambdaRestApi(this, 'Endpoint', {
      handler,
      integrationOptions: {
        timeout: Duration.seconds(10)
      }
    });
    return new CfnOutput(this, 'GatewayUrl', { value: gateway.url })
  }

  private initializeTableViewer(table: Table): CfnOutput {
    const viewer = new TableViewer(this, 'ViewHitCounter', {
      title: 'Hello Hits',
      sortBy: '-hits',
      table
    });
    return new CfnOutput(this, 'TableViewerUrl', { value: viewer.endpoint });
  }
}
