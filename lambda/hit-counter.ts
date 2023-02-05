import { LambdaEvent, LambdaResponse } from '../interfaces/lambda-interfaces';
import { increaseDbCountFor } from '../resources/dynamo-utils';
import { invokeLambda } from '../resources/invoke-lambda';

export const hitCounter = async (event: LambdaEvent): Promise<LambdaResponse> => {
  await increaseDbCountFor(event.path);
  const response = await invokeLambda(
    process.env.DOWNSTREAM_FUNCTION_NAME!,
    event
  );
  return JSON.parse(response);
};
