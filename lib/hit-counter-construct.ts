import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { Database } from '../resources/database';

export interface HitCounterProps {
  downstream: IFunction;
}

export class HitCounterConstruct extends Construct {
  constructor (scope: Construct, id: string, props?: HitCounterProps) {
    super(scope, id);

    const table = new Database(this, 'Database');
  }
}