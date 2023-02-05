import { Duration } from 'aws-cdk-lib';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { IFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';
import { DatabaseConstruct } from './database-construct';

export interface HitCounterProps {
  downstream: IFunction;
}

export class HitCounterConstruct extends Construct {
  public readonly handler: NodejsFunction;
  public readonly table: Table;

  constructor (
    scope: Construct,
    id: string,
    private props: HitCounterProps
  ) {
    super(scope, id);
    this.table = this.initializeDatabase();
    this.handler = this.initializeLambda();
    this.setPermissions();
  }

  private initializeDatabase(): Table {
    return new DatabaseConstruct(this, 'Database').db;
  }

  private initializeLambda(): NodejsFunction {
    return new NodejsFunction(this, 'HitCounterHandler', {
      runtime: Runtime.NODEJS_14_X,
      entry: join(__dirname, `/../lambda/hit-counter.ts`),
      handler: 'hitCounter',
      timeout: Duration.seconds(4),
      memorySize: 128,
      environment: {
        DOWNSTREAM_FUNCTION_NAME: this.props.downstream.functionName,
        HITS_TABLE_NAME: this.table.tableName
      }
    });
  }

  private setPermissions(): void {
    this.table.grantReadWriteData(this.handler);
    this.props.downstream.grantInvoke(this.handler);
  }
}
