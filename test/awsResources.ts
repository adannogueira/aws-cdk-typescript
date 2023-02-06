export const aws = {
  lambda: {
    function: 'AWS::Lambda::Function'
  },
  apiGateway: {
    deployment: 'AWS::ApiGateway::Deployment',
    restApi: 'AWS::ApiGateway::RestApi',
    method: 'AWS::ApiGateway::Method'
  },
  dynamoDb: {
    table: 'AWS::DynamoDB::Table'
  },
  iam: {
    policy: 'AWS::IAM::Policy'
  },
  codeCommit: {
    repository: 'AWS::CodeCommit::Repository'
  },
  codePipeline: {
    pipeline: 'AWS::CodePipeline::Pipeline'
  },
  codeBuild: {
    project: 'AWS::CodeBuild::Project'
  }
}