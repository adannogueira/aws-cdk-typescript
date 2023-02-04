import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Database } from '../../resources/database';

describe('Database', () => {
  it('Should be correctly instantiated', () => {
    const stack = new Stack();
    const database = new Database(stack, 'MyDatabase');
    expect(database).toBeInstanceOf(Object);
  });

  it('Should create a DynamoDB table', () => {
    const stack = new Stack();
    new Database(stack, 'MyDatabase');
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::DynamoDB::Table', 1);
  });
});
