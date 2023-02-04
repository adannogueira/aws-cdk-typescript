import { Lambda } from 'aws-sdk';
import { LambdaEvent } from '../interfaces/lambda-interfaces';
  
export const invokeLambda = async (
  functionName: string,
  payload: LambdaEvent
): Promise<string> => {
  const lambda = new Lambda();
  const response = await lambda
    .invoke({
      FunctionName: functionName,
      Payload: JSON.stringify(payload)
    })
    .promise()
  return JSON.stringify(response.Payload);
}