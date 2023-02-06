import { LambdaEvent } from '../../interfaces/lambda-interfaces';
import { hello } from '../../lambda/hello'

describe('hello()', () => {
  it('Should return an object containing a body with the path', async () => {
    // Arrange
    const event: LambdaEvent = {
      path: 'any/path'
    } as any;

    // Act
    const response = await hello(event);

    // Assert
    expect(response.body).toMatch(/any\/path/);
  });

  it('Should return an object containing statusCode 200', async () => {
    // Act
    const response = await hello({} as LambdaEvent);

    // Assert
    expect(response.statusCode).toBe(200);
  });
})