jest.mock('aws-sdk', () => {
  const mDocumentClient = {
    put: jest.fn().mockReturnThis(),
    get: jest.fn().mockReturnThis(),
    scan: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  };
  const mS3 = {
    putObject: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  };
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => mDocumentClient),
    },
    S3: jest.fn(() => mS3),
  };
});

import * as potholeService from '../services/potholeService';
import { DynamoDB, S3 } from 'aws-sdk';

describe('potholeService', () => {
  let mDocumentClient: any;
  let mS3: any;

  beforeEach(() => {
    // Mock config for tests
    jest.doMock('../config', () => ({
      config: {
        TABLE_NAME: 'test-table',
        BUCKET_NAME: 'test-bucket',
        DEFAULT_PAGE_SIZE: 30,
      }
    }));
    mDocumentClient = new DynamoDB.DocumentClient();
    mS3 = new S3();
    jest.clearAllMocks();
  });

  it('createPothole should save item and upload photos', async () => {
    mDocumentClient.put().promise.mockResolvedValueOnce(undefined);
    mS3.putObject().promise.mockResolvedValueOnce(undefined);
    const data = { province: 'SJ', county: 'Central', district: 'Carmen', street: 'Main Ave', latitude: 9.9, longitude: -84.1 };
    const pothole = await potholeService.createPothole(data, [Buffer.from('fakeimg')]);
    expect(mDocumentClient.put).toHaveBeenCalled();
    expect(mS3.putObject).toHaveBeenCalled();
    expect(pothole.id).toBeDefined();
    expect(pothole.photos?.length).toBe(1);
  });

  it('getPotholeById should return item', async () => {
    mDocumentClient.get().promise.mockResolvedValueOnce({ Item: { id: '1', province: 'SJ' } });
    const result = await potholeService.getPotholeById('1');
    expect(result).toEqual({ id: '1', province: 'SJ' });
  });

  it('getPotholeById should return null if not found', async () => {
    mDocumentClient.get().promise.mockResolvedValueOnce({});
    const result = await potholeService.getPotholeById('2');
    expect(result).toBeNull();
  });

  it('updatePothole should update and return item', async () => {
    mDocumentClient.get().promise.mockResolvedValueOnce({ Item: { id: '1', province: 'SJ' } });
    mDocumentClient.put().promise.mockResolvedValueOnce(undefined);
    const result = await potholeService.updatePothole('1', { province: 'Heredia' });
    expect(mDocumentClient.put).toHaveBeenCalled();
    expect(result?.province).toBe('Heredia');
  });

  it('updatePothole should return null if not found', async () => {
    mDocumentClient.get().promise.mockResolvedValueOnce({});
    const result = await potholeService.updatePothole('2', { province: 'Alajuela' });
    expect(result).toBeNull();
  });

  it('listPotholes should paginate results', async () => {
    const items = Array.from({ length: 50 }, (_, i) => ({ id: String(i) }));
    mDocumentClient.scan().promise.mockResolvedValueOnce({ Items: items });
    const result = await potholeService.listPotholes(2, 30);
    expect(result.length).toBe(20);
    expect(result[0].id).toBe('30');
  });
}); 