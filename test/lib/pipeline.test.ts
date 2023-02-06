import { App } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { PipelineStack } from '../../lib/stacks/pipeline-stack';
import { aws } from '../awsResources';

describe('PipelineStack', () => {
  it('Should create CodeCommit Repository correctly', () => {
    // Arrange & Act
    const template = makeSut();

    // Assert
    template.resourceCountIs(aws.codeCommit.repository, 1);
  });

  it('Should grant permission and create a pipeline correctly', () => {
    // Arrange & Act
    const template = makeSut();

    // Assert
    template.resourceCountIs(aws.codePipeline.pipeline, 1);
    template.hasResourceProperties(aws.codeBuild.project, {
      Source: {
        BuildSpec: Match.stringLikeRegexp('npm install -g aws-cdk')
      }
    });
    template.hasResourceProperties(aws.iam.policy, {
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
    template.hasResourceProperties(aws.codePipeline.pipeline, {
      Stages: Match.arrayWith([
        Match.objectLike({ Name: 'Deploy' })
      ])
    });
  });

  it('Should add pre deploy stages to CodeCommit pipeline', () => {
    // Arrange & Act
    const template = makeSut();

    // Assert
    template.hasResourceProperties(aws.codePipeline.pipeline, {
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
    template.hasResourceProperties(aws.codePipeline.pipeline, {
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
