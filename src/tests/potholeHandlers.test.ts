import * as handlers from '../handlers/potholeHandlers';
import * as service from '../services/potholeService';

jest.mock('../services/potholeService');

const mockEvent = (body?: any, pathParameters?: any, queryStringParameters?: any) => ({
  body: body ? JSON.stringify(body) : undefined,
  pathParameters,
  queryStringParameters,
} as any);

describe('potholeHandlers', () => {
  beforeEach(() => jest.clearAllMocks());

  it('createPotholeHandler returns 201 and the pothole', async () => {
    (service.createPothole as jest.Mock).mockResolvedValue({ id: '1', province: 'SJ' });
    const res = await handlers.createPotholeHandler(mockEvent({ province: 'SJ' }));
    expect(res.statusCode).toBe(201);
    expect(JSON.parse(res.body).id).toBe('1');
  });

  it('createPotholeHandler returns 400 on error', async () => {
    (service.createPothole as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await handlers.createPotholeHandler(mockEvent({}));
    expect(res.statusCode).toBe(400);
  });

  it('updatePotholeHandler returns 200 and the updated pothole', async () => {
    (service.updatePothole as jest.Mock).mockResolvedValue({ id: '1', province: 'Heredia' });
    const res = await handlers.updatePotholeHandler(mockEvent({ province: 'Heredia' }, { id: '1' }));
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).province).toBe('Heredia');
  });

  it('updatePotholeHandler returns 404 if not found', async () => {
    (service.updatePothole as jest.Mock).mockResolvedValue(null);
    const res = await handlers.updatePotholeHandler(mockEvent({ province: 'Heredia' }, { id: '2' }));
    expect(res.statusCode).toBe(404);
  });

  it('getPotholeByIdHandler returns 200 if found', async () => {
    (service.getPotholeById as jest.Mock).mockResolvedValue({ id: '1', province: 'SJ' });
    const res = await handlers.getPotholeByIdHandler(mockEvent(undefined, { id: '1' }));
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).id).toBe('1');
  });

  it('getPotholeByIdHandler returns 404 if not found', async () => {
    (service.getPotholeById as jest.Mock).mockResolvedValue(null);
    const res = await handlers.getPotholeByIdHandler(mockEvent(undefined, { id: '2' }));
    expect(res.statusCode).toBe(404);
  });

  it('listPotholesHandler returns 200 and the list', async () => {
    (service.listPotholes as jest.Mock).mockResolvedValue([{ id: '1' }, { id: '2' }]);
    const res = await handlers.listPotholesHandler(mockEvent(undefined, undefined, { page: '1' }));
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).length).toBe(2);
  });
}); 