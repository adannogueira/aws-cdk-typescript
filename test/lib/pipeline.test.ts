import { App } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { PipelineStack } from '../../lib/stacks/pipeline-stack';

describe('PipelineStack', () => {
  it('Should create CodeCommit Repository correctly', () => {
    const app = new App();
    const stack = new PipelineStack(app, 'MyTestStack');
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::CodeCommit::Repository', 1);
  });

  it('Should grant permission and create a pipeline correctly', () => {
    const app = new App();
    const stack = new PipelineStack(app, 'MyTestStack');
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::CodePipeline::Pipeline', 1);
    template.hasResourceProperties('AWS::CodeBuild::Project', {
      Source: {
        BuildSpec: Match.stringLikeRegexp('npm install -g aws-cdk')
      }
    });
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Effect: 'Allow',
            Action: Match.arrayWith(['codebuild:StartBuild'])
          })
        ])
      }
    })
  });
});
