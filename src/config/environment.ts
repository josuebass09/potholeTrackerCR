export interface EnvironmentConfig {
  // AWS Services
  TABLE_NAME: string;
  BUCKET_NAME: string;
  AWS_REGION: string;
  
  // API Configuration
  API_STAGE: string;
  API_VERSION: string;
  
  // Application Settings
  APP_NAME: string;
  APP_ENV: string;
  
  // Pagination
  DEFAULT_PAGE_SIZE: number;
  MAX_PAGE_SIZE: number;
  
  // File Upload
  MAX_FILE_SIZE: number;
  ALLOWED_FILE_TYPES: string[];
  
  // Validation
  MAX_DESCRIPTION_LENGTH: number;
  MIN_DESCRIPTION_LENGTH: number;
}

export const getEnvironmentConfig = (): EnvironmentConfig => {
  const config: EnvironmentConfig = {
    // AWS Services
    TABLE_NAME: process.env.TABLE_NAME || 'potholes',
    BUCKET_NAME: process.env.BUCKET_NAME || 'pothole-photos-bucket',
    AWS_REGION: process.env.AWS_REGION || 'us-east-1',
    
    // API Configuration
    API_STAGE: process.env.API_STAGE || 'prod',
    API_VERSION: process.env.API_VERSION || 'v1',
    
    // Application Settings
    APP_NAME: process.env.APP_NAME || 'PotholeTrackerCR',
    APP_ENV: process.env.APP_ENV || 'production',
    
    // Pagination
    DEFAULT_PAGE_SIZE: parseInt(process.env.DEFAULT_PAGE_SIZE || '30'),
    MAX_PAGE_SIZE: parseInt(process.env.MAX_PAGE_SIZE || '100'),
    
    // File Upload
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB
    ALLOWED_FILE_TYPES: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif').split(','),
    
    // Validation
    MAX_DESCRIPTION_LENGTH: parseInt(process.env.MAX_DESCRIPTION_LENGTH || '500'),
    MIN_DESCRIPTION_LENGTH: parseInt(process.env.MIN_DESCRIPTION_LENGTH || '10'),
  };
  
  return config;
};

export const config = getEnvironmentConfig(); 