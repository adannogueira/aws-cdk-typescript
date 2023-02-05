import { Stack, StackProps } from 'aws-cdk-lib';
import { Repository } from 'aws-cdk-lib/aws-codecommit';
import { CodeBuildStep, CodePipeline, CodePipelineSource } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const repository = this.createRepository();
    this.createPipeline(repository);
  }

  private createRepository(): Repository {
    return new Repository(this, 'TypescriptRepo', {
      repositoryName: 'TypescriptRepo'
    });
  }

  private createPipeline(repository: Repository): void {
    new CodePipeline(this, 'Pipeline', {
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
}
