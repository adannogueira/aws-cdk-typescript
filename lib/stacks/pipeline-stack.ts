import { Stack, StackProps } from 'aws-cdk-lib';
import { Repository } from 'aws-cdk-lib/aws-codecommit';
import { CodeBuildStep, CodePipeline, CodePipelineSource, StageDeployment } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { DeployStage } from '../stages/deploy-stage';

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const repository = this.createRepository();
    const pipeline = this.createPipeline(repository);
    this.addStage(pipeline);
  }

  private createRepository(): Repository {
    return new Repository(this, 'TypescriptRepo', {
      repositoryName: 'TypescriptRepo'
    });
  }

  private createPipeline(repository: Repository): CodePipeline {
    return new CodePipeline(this, 'Pipeline', {
      pipelineName: 'BasicPipeline',
      crossAccountKeys: false,
      synth: new CodeBuildStep('SynthStep', {
        input: CodePipelineSource.codeCommit(repository, 'main'),
        installCommands: ['npm install -g aws-cdk'],
        commands: [
          'npm ci',
          'npm run build',
          'npx cdk synth'
        ]
      })
    });
  }

  private addStage(pipeline: CodePipeline): void {
    const deploy = new DeployStage(this, 'Deploy');
    const stage = pipeline.addStage(deploy);
    this.addPreDeploymentStepsToStage(deploy, stage);
    this.addPostDeploymentStepsToStage(deploy, stage);
  }

  private addPreDeploymentStepsToStage(deploy: DeployStage,
    stage: StageDeployment
  ): void {
    stage.addPre(
      new CodeBuildStep('TestUnit', {
        projectName: 'UnitTesting',
        installCommands: ['npm install'],
        commands: ['npm test']
      })
    );
  }

  private addPostDeploymentStepsToStage (
    deploy: DeployStage,
    stage: StageDeployment
  ): void {
    stage.addPost(
      new CodeBuildStep('TestViewerEndpoint', {
        projectName: 'TestViewerEndpoint',
        envFromCfnOutputs: {
          ENDPOINT_URL: deploy.hitCounterViewerUrl
        },
        commands: ['curl -Ssf $ENDPOINT_URL']
      }),
      new CodeBuildStep('TestAPIGatewayEndpoint', {
        projectName: 'TestAPIGatewayEndpoint',
        envFromCfnOutputs: {
          ENDPOINT_URL: deploy.hitCounterEndpoint
        },
        commands: [
          'curl -Ssf $ENDPOINT_URL',
          'surl -Ssf $ENDPOINT_URL/hello',
          'surl -Ssf $ENDPOINT_URL/test'
        ]
      })
    );
  }
}
