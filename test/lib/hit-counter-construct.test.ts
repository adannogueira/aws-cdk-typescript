import { Stack } from 'aws-cdk-lib';
import { Capture, Match, Template } from 'aws-cdk-lib/assertions';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { HitCounterConstruct } from '../../lib/constructs/hit-counter-construct';

describe('HitCounterConstruct', () => {
  it('Should create DynamoDB Table', () => {
    const template = makeSut();
    template.resourceCountIs('AWS::DynamoDB::Table', 1);
  });

  it('Should pass environment variables to lambda function', () => {
    const template = makeSut();
    const envCapture = new Capture();
    template.hasResourceProperties('AWS::Lambda::Function', {
      Environment: envCapture
    });
    expect(envCapture.asObject()).toEqual({
      Variables: {
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        DOWNSTREAM_FUNCTION_NAME: {
          Ref: 'TestFunction22AD90FC'
        },
        HITS_TABLE_NAME: {
          Ref: 'TestConstructDatabaseHitsE0602B24'
        }
      }
    });
  });

  it('Should grant HitCounter function Table read/write access', () => {
    const template = makeSut();
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Effect: 'Allow',
            Action: Match.arrayWith([
              'dynamodb:GetItem',
              'dynamodb:PutItem'
            ])
          })
        ])
      }
    });
  });

  it('Should grant HitCounter function permission to invoke downstream function', () => {
    const template = makeSut();
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Effect: 'Allow',
            Action: 'lambda:InvokeFunction'
          })
        ])
      }
    });
  });
});

const makeSut = () => {
  const stack = new Stack();
  const lambda = new Function(stack, 'TestFunction', {
    runtime: Runtime.NODEJS_14_X,
    code: Code.fromAsset('lambda'),
    handler: 'hello'
  });
  new HitCounterConstruct(stack, 'TestConstruct', {
    downstream: lambda
  });
  const template = Template.fromStack(stack);
  return template;
}