import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { DatabaseConstruct } from '../../lib/constructs/database-construct';

describe('DatabaseConstruct', () => {
  it('Should be correctly instantiated', () => {
    // Arrange & Act
    const { database } = buildResources();

    // Assert
    expect(database).toBeInstanceOf(Object);
  });

  it('Should create a DynamoDB table', () => {
    // Arrange & Act
    const { template } = buildResources();

    // Assert
    template.resourceCountIs('AWS::DynamoDB::Table', 1);
  });

  it('Should encrypt DynamoDB table', () => {
    // Arrange & Act
    const { template } = buildResources();

    // Assert
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      SSESpecification: { SSEEnabled: true }
    });
  });

  it('Should destroy DynamoDB table on stack deletion', () => {
    // Arrange & Act
    const { template } = buildResources();

    // Assert
    template.hasResource('AWS::DynamoDB::Table', {
      DeletionPolicy: 'Delete'
    });
  });
});

const buildResources = () => {
  const stack = new Stack();
  const database = new DatabaseConstruct(stack, 'MyDatabase');
  const template = Template.fromStack(stack);
  return { template, database };
}