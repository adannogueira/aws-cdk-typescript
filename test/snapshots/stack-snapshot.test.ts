import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { CdkTypescriptStack } from '../../lib/stacks/cdk-typescript-stack';
import { PipelineStack } from '../../lib/stacks/pipeline-stack';

test('PipelineStack matches the snapshot', () => {
  // Arrange 
  const app = new App();
  const stack = new PipelineStack(app, 'TestStack');

  // Act
  const template = Template.fromStack(stack);

  // Assert
  expect(template.toJSON()).toMatchSnapshot();
});

test('TypescriptStack matches the snapshot', () => {
  // Arrange
  const app = new App();
  const stack = new CdkTypescriptStack(app, 'TestStack');

  // Act
  const template = Template.fromStack(stack);

  // Assert
  expect(template.toJSON()).toMatchSnapshot();
});
