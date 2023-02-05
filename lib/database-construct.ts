import { RemovalPolicy } from 'aws-cdk-lib';
import { AttributeType, Table, TableEncryption } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class Database extends Construct {
  public readonly db: Table;

  constructor (scope: Construct, id: string) {
    super(scope, id);

    this.db = new Table(this, 'Hits', {
      partitionKey: { name: 'path', type: AttributeType.STRING },
      encryption: TableEncryption.AWS_MANAGED,
      removalPolicy: RemovalPolicy.DESTROY
    });
  }
}
