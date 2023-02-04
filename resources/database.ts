import { RemovalPolicy } from 'aws-cdk-lib';
import { AttributeType, Table, TableEncryption } from 'aws-cdk-lib/aws-dynamodb';
import { DynamoDB } from 'aws-sdk';
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

export const increaseDbCountFor = async (endpoint: string): Promise<void> => {
  const dynamo = new DynamoDB();
  await dynamo.updateItem({
    TableName: process.env.HITS_TABLE_NAME!,
    Key: { path: { S: endpoint } },
    UpdateExpression: 'ADD hits :incr',
    ExpressionAttributeValues: { ':incr' : { N: '1' } }
  }).promise()
}