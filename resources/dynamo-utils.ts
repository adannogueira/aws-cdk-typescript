import { DynamoDB } from 'aws-sdk';

export const increaseDbCountFor = async (endpoint: string): Promise<void> => {
  const dynamo = new DynamoDB();
  await dynamo.updateItem({
    TableName: process.env.HITS_TABLE_NAME!,
    Key: { path: { S: endpoint } },
    UpdateExpression: 'ADD hits :incr',
    ExpressionAttributeValues: { ':incr' : { N: '1' } }
  }).promise()
}