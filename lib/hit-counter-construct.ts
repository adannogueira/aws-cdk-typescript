import { Table } from 'aws-cdk-lib/aws-dynamodb';
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

  constructor (
    scope: Construct,
    id: string,
    private props: HitCounterProps
  ) {
    super(scope, id);
    const table = this.initializeDatabase();
    this.handler = this.initializeLambda(table);
    table.grantReadWriteData(this.handler);
  }

  private initializeDatabase(): Table {
    return new Database(this, 'Database').db;
  }

  private initializeLambda(table: Table): NodejsFunction {
    return new NodejsFunction(this, 'HitCounterHandler', {
      runtime: Runtime.NODEJS_14_X,
      entry: join(__dirname, `/../lambda/hit-counter.ts`),
      handler: 'hitCounter',
      environment: {
        DOWNSTREAM_FUNCTION_NAME: this.props.downstream.functionName,
        HITS_TABLE_NAME: table.tableName
      }
    });
  }
}
