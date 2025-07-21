import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { config } from '../config';

export const loginWithApiKeyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // API Gateway already validates the API Key, but here we can return useful info
  const apiKey = event.headers['x-api-key'] || event.headers['X-API-KEY'];
  if (!apiKey) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'API Key required' })
    };
  }
  // You could add additional logic here if you want to associate users with API Keys
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      message: 'Login successful', 
      apiKey: apiKey.substring(0, 8) + '...', // Only show part of the key for security
      appName: config.APP_NAME,
      version: config.API_VERSION,
      stage: config.API_STAGE
    })
  };
}; 