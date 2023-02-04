import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { HitCounterConstruct } from '../../lib/hit-counter-construct';

describe('HitCounterConstruct', () => {
  it('Should create DynamoDB Table', () => {
    const stack = new Stack();
    new HitCounterConstruct(stack, 'TestConstruct');
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::DynamoDB::Table', 1);
  })
})