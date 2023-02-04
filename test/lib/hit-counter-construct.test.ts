import { Stack } from 'aws-cdk-lib';
import { Capture, Template } from 'aws-cdk-lib/assertions';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { HitCounterConstruct } from '../../lib/hit-counter-construct';

describe('HitCounterConstruct', () => {
  it('Should create DynamoDB Table', () => {
    const stack = new Stack();
    new HitCounterConstruct(stack, 'TestConstruct', {
      downstream: new Function(stack, 'TestFunction', {
        runtime: Runtime.NODEJS_14_X,
        code: Code.fromAsset('lambda'),
        handler: 'hello'
      })
    });
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::DynamoDB::Table', 1);
  });

  it('Should pass environment variables to lambda function', () => {
    const stack = new Stack();
    new HitCounterConstruct(stack, 'TestConstruct', {
      downstream: new Function(stack, 'TestFunction', {
        runtime: Runtime.NODEJS_14_X,
        code: Code.fromAsset('lambda'),
        handler: 'hello'
      })
    });
    const template = Template.fromStack(stack);
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
});
