import { LambdaEvent, LambdaResponse } from '../interfaces/lambda-interfaces';

export const hello = async (event: LambdaEvent): Promise<LambdaResponse> => {
  console.log('Request::', JSON.stringify(event, undefined, 2));
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/plain' },
    body: `Hello, CDK! You've hit ${event.path}\n`
  };
}