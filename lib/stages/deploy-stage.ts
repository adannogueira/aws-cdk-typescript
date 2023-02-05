import { CfnOutput, Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CdkTypescriptStack } from '../stacks/cdk-typescript-stack';

export class DeployStage extends Stage {
  public readonly hitCounterViewerUrl: CfnOutput;
  public readonly hitCounterEndpoint: CfnOutput;

  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);
    const service = new CdkTypescriptStack(this, 'WebService');
    this.hitCounterEndpoint = service.hitCounterEndpoint;
    this.hitCounterViewerUrl = service.hitCounterViewerUrl;
  }
}