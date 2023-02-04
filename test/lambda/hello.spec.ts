import { LambdaEvent } from '../../interfaces/lambda-interfaces';
import { hello } from '../../lambda/hello'

describe('hello()', () => {
  it('Should return an object containing a body with the path', async () => {
    const event: LambdaEvent = {
      path: 'any/path'
    } as any;
    const response = await hello(event);
    expect(response.body).toMatch(/any\/path/);
  });

  it('Should return an object containing statusCode 200', async () => {
    const response = await hello({} as LambdaEvent);
    expect(response.statusCode).toBe(200);
  });
})