import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createPothole, updatePothole, getPotholeById, listPotholes } from '../services/potholeService';
import { config } from '../config';

// POST /potholes
export const createPotholeHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const data = JSON.parse(event.body || '{}');
    // Validation using config
    if (data.description && data.description.length > config.MAX_DESCRIPTION_LENGTH) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Description too long. Max ${config.MAX_DESCRIPTION_LENGTH} characters.` })
      };
    }
    if (data.description && data.description.length < config.MIN_DESCRIPTION_LENGTH) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Description too short. Min ${config.MIN_DESCRIPTION_LENGTH} characters.` })
      };
    }
    // TODO: Handle photo files if sent (currently only data)
    const pothole = await createPothole(data);
    return {
      statusCode: 201,
      body: JSON.stringify(pothole)
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: (err as Error).message })
    };
  }
};

// PUT /potholes/{id}
export const updatePotholeHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;
    if (!id) throw new Error('ID required');
    const updates = JSON.parse(event.body || '{}');
    // Validation using config
    if (updates.description && updates.description.length > config.MAX_DESCRIPTION_LENGTH) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Description too long. Max ${config.MAX_DESCRIPTION_LENGTH} characters.` })
      };
    }
    if (updates.description && updates.description.length < config.MIN_DESCRIPTION_LENGTH) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Description too short. Min ${config.MIN_DESCRIPTION_LENGTH} characters.` })
      };
    }
    const updated = await updatePothole(id, updates);
    if (!updated) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Not found' }) };
    }
    return { statusCode: 200, body: JSON.stringify(updated) };
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: (err as Error).message }) };
  }
};

// GET /potholes/{id}
export const getPotholeByIdHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;
    if (!id) throw new Error('ID required');
    const pothole = await getPotholeById(id);
    if (!pothole) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Not found' }) };
    }
    return { statusCode: 200, body: JSON.stringify(pothole) };
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: (err as Error).message }) };
  }
};

// GET /potholes?page=1
export const listPotholesHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const page = event.queryStringParameters?.page ? parseInt(event.queryStringParameters.page, 10) : 1;
    const pageSize = event.queryStringParameters?.pageSize ? 
      Math.min(parseInt(event.queryStringParameters.pageSize, 10), config.MAX_PAGE_SIZE) : 
      config.DEFAULT_PAGE_SIZE;
    const potholes = await listPotholes(page, pageSize);
    return { statusCode: 200, body: JSON.stringify(potholes) };
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: (err as Error).message }) };
  }
}; 