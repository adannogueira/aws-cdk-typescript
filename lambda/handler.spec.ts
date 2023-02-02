import { LambdaEvent } from '../interfaces/lambda-interfaces';
import { hello } from './handler'

describe('hello()', () => {
  it('Should return an object containing a body with the path', async () => {
    const event: LambdaEvent = {
      path: 'any/path'
    } as any;
    const response = await hello(event);
    expect(response.body).toMatch(/any\/path/);
  });
})