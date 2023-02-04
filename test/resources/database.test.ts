import { Stack } from 'aws-cdk-lib';
import { Database } from '../../resources/database'

describe('Database', () => {
  it('Should be correctly instantiated', () => {
    const stack = new Stack();
    const database = new Database(stack, 'MyDatabase');
    expect(database).toBeInstanceOf(Object);
  });
});
