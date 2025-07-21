export interface Pothole {
  id: string;
  province: string;
  county: string;
  district: string;
  street: string;
  latitude: number;
  longitude: number;
  description?: string;
  reportDate: string; // ISO string
  status: 'reported' | 'in_progress' | 'fixed' | 'ignored';
  photos?: string[]; // URLs
  reporter?: string; // ID or email
  priority?: 'low' | 'medium' | 'high';
  reportCount?: number;
  lastUpdateDate?: string; // ISO string
}
