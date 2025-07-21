import { DynamoDB, S3 } from 'aws-sdk';
import { Pothole } from '../models';
import { config } from '../config';
import { v4 as uuidv4 } from 'uuid';

const dynamoDb = new DynamoDB.DocumentClient();
export const s3 = new S3();

const { TABLE_NAME, BUCKET_NAME } = config;

export async function createPothole(data: Partial<Pothole>, photoFiles?: Buffer[]): Promise<Pothole> {
  const id = uuidv4();
  const reportDate = new Date().toISOString();
  const pothole: Pothole = {
    ...data,
    id,
    reportDate,
    status: 'reported',
    reportCount: 1,
    photos: [],
  } as Pothole;

  // Upload photos if provided
  if (photoFiles && photoFiles.length > 0) {
    for (const [i, file] of photoFiles.entries()) {
      const key = `${id}/photo_${i + 1}.jpg`;
      await s3.putObject({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file,
        ContentType: 'image/jpeg',
      }).promise();
      pothole.photos!.push(`https://${BUCKET_NAME}.s3.amazonaws.com/${key}`);
    }
  }

  await dynamoDb.put({ TableName: TABLE_NAME, Item: pothole }).promise();
  return pothole;
}

export async function updatePothole(id: string, updates: Partial<Pothole>): Promise<Pothole | null> {
  // Get current pothole
  const current = await getPotholeById(id);
  if (!current) return null;
  const updated: Pothole = {
    ...current,
    ...updates,
    lastUpdateDate: new Date().toISOString(),
  };
  await dynamoDb.put({ TableName: TABLE_NAME, Item: updated }).promise();
  return updated;
}

export async function getPotholeById(id: string): Promise<Pothole | null> {
  const res = await dynamoDb.get({ TableName: TABLE_NAME, Key: { id } }).promise();
  return res.Item as Pothole || null;
}

export async function listPotholes(page: number = 1, pageSize: number = config.DEFAULT_PAGE_SIZE): Promise<Pothole[]> {
  const res = await dynamoDb.scan({ TableName: TABLE_NAME }).promise();
  const items = (res.Items as Pothole[]) || [];
  // Simple in-memory pagination
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}
