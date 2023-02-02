import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda'

export type LambdaEvent = APIGatewayEvent;

export type LambdaResponse = APIGatewayProxyResult;
