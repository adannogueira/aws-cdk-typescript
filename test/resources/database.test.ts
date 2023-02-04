import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Database } from '../../resources/database';

describe('Database', () => {
  it('Should be correctly instantiated', () => {
    const { database } = buildResources();
    expect(database).toBeInstanceOf(Object);
  });

  it('Should create a DynamoDB table', () => {
    const { stack } = buildResources();
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::DynamoDB::Table', 1);
  });
});

const buildResources = () => {
  const stack = new Stack();
  const database = new Database(stack, 'MyDatabase');
  return { stack, database };
}