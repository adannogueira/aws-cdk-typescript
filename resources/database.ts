import { AttributeType, Table, TableEncryption } from 'aws-cdk-lib/aws-dynamodb';
import { DynamoDB } from 'aws-sdk';
import { Construct } from 'constructs';

export class Database extends Construct {
  public readonly db: Table;
  private readonly dynamo = new DynamoDB();

  constructor (scope: Construct, id: string) {
    super(scope, id);

    this.db = new Table(this, 'Hits', {
      partitionKey: { name: 'path', type: AttributeType.STRING },
      encryption: TableEncryption.AWS_MANAGED
    });
  }
}