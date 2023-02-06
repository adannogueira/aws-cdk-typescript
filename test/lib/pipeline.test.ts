import { App } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { PipelineStack } from '../../lib/stacks/pipeline-stack';

describe('PipelineStack', () => {
  it('Should create CodeCommit Repository correctly', () => {
    // Arrange & Act
    const template = makeSut();

    // Assert
    template.resourceCountIs('AWS::CodeCommit::Repository', 1);
  });

  it('Should grant permission and create a pipeline correctly', () => {
    // Arrange & Act
    const template = makeSut();

    // Assert
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
    });
  });

  it('Should add deploy stage to CodeCommit pipeline', () => {
    // Arrange & Act
    const template = makeSut();

    // Assert
    template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: Match.arrayWith([
        Match.objectLike({ Name: 'Deploy' })
      ])
    });
  });

  it('Should add pre deploy stages to CodeCommit pipeline', () => {
    // Arrange & Act
    const template = makeSut();

    // Assert
    template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: Match.arrayWith([
        Match.objectLike({
          Actions: Match.arrayWith([
            Match.objectLike({ Name: 'TestUnit' }),
          ])
        })
      ])
    });
  });

  it('Should add post deploy stages to CodeCommit pipeline', () => {
    // Arrange & Act
    const template = makeSut();

    // Assert
    template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: Match.arrayWith([
        Match.objectLike({
          Actions: Match.arrayWith([
            Match.objectLike({ Name: 'TestAPIGatewayEndpoint' }),
            Match.objectLike({ Name: 'TestViewerEndpoint' })
          ])
        })
      ])
    });
  });
});

const makeSut = () => {
  const app = new App();
  const stack = new PipelineStack(app, 'MyTestStack');
  const template = Template.fromStack(stack);
  return template;
};
