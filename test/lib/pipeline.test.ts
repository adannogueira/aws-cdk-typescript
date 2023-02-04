import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { PipelineStack } from '../../lib/pipeline-stack';

describe('PipelineStack', () => {
  it('Should create CodeCommit Repository correctly', () => {
    const app = new App();
    const stack = new PipelineStack(app, 'MyTestStack');
    const sut = Template.fromStack(stack);
    sut.resourceCountIs('AWS::CodeCommit::Repository', 1);
  });
});
