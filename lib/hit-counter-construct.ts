import { IFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';
import { Database } from '../resources/database';

export interface HitCounterProps {
  downstream: IFunction;
}

export class HitCounterConstruct extends Construct {
  public readonly handler: NodejsFunction;

  constructor (scope: Construct, id: string, props: HitCounterProps) {
    super(scope, id);

    const table = new Database(this, 'Database').db;
    this.handler = new NodejsFunction(this, 'HitCounterHandler', {
      runtime: Runtime.NODEJS_14_X,
      entry: join(__dirname, `/../lambda/hit-counter.ts`),
      handler: 'hitCounter',
      environment: {
        DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
        HITS_TABLE_NAME: table.tableName
      }
    })
    table.grantReadWriteData(this.handler);
  }
}