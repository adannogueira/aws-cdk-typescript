import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Database } from '../../resources/database';

describe('Database', () => {
  it('Should be correctly instantiated', () => {
    const { database } = buildResources();
    expect(database).toBeInstanceOf(Object);
  });

  it('Should create a DynamoDB table', () => {
    const { template } = buildResources();
    template.resourceCountIs('AWS::DynamoDB::Table', 1);
  });

  it('Should encrypt DynamoDB table', () => {
    const { template } = buildResources();
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      SSESpecification: { SSEEnabled: true }
    });
  });

  it('Should destroy DynamoDB table on stack deletion', () => {
    const { template } = buildResources();
    template.hasResource('AWS::DynamoDB::Table', {
      DeletionPolicy: 'Delete'
    });
  });
});

const buildResources = () => {
  const stack = new Stack();
  const database = new Database(stack, 'MyDatabase');
  const template = Template.fromStack(stack);
  return { template, database };
}