// Type definitions for SentinelConnect

export type DatabaseType = 'postgresql' | 'mysql' | 'mssql' | 'oracle' | 'sqlite';

export type ConnectionStatus = 'connected' | 'failed' | 'untested';

export type SyncMode = 'full' | 'incremental';

export type ScheduleType = 'manual' | 'hourly' | 'daily' | 'weekly' | 'cron';

export type MaskingType = 'none' | 'redact' | 'hash' | 'randomize' | 'partial';

export type JobStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface DataSource {
  id: string;
  name: string;
  description?: string | null;
  dbType: string;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  sslEnabled: boolean;
  isActive: boolean;
  lastTestedAt?: Date | null;
  connectionStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SyncConfig {
  id: string;
  name: string;
  description?: string | null;
  dataSourceId: string;
  dataSource?: DataSource;
  isActive: boolean;
  syncMode: string;
  scheduleType: string;
  cronExpression?: string | null;
  outputPath: string;
  outputFileName: string;
  compressOutput: boolean;
  encryptOutput: boolean;
  tableConfigs?: TableConfig[];
  syncJobs?: SyncJob[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TableConfig {
  id: string;
  syncConfigId: string;
  sourceSchema: string;
  sourceTable: string;
  targetTable?: string | null;
  whereClause?: string | null;
  rowLimit?: number | null;
  incrementalColumn?: string | null;
  lastSyncValue?: string | null;
  columnConfigs?: ColumnConfig[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ColumnConfig {
  id: string;
  tableConfigId: string;
  sourceColumn: string;
  targetColumn?: string | null;
  dataType?: string | null;
  maskingType: string;
  maskingConfig?: string | null;
  isIncluded: boolean;
  isPrimaryKey: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SyncJob {
  id: string;
  syncConfigId: string;
  syncConfig?: SyncConfig;
  status: string;
  startedAt?: Date | null;
  completedAt?: Date | null;
  rowsProcessed: number;
  tablesProcessed: number;
  outputFileSize?: number | null;
  outputFilePath?: string | null;
  errorMessage?: string | null;
  errorDetails?: string | null;
  triggeredBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  eventType: string;
  eventDetails?: string | null;
  userId?: string | null;
  userEmail?: string | null;
  ipAddress?: string | null;
  resourceType?: string | null;
  resourceId?: string | null;
  dataSourceId?: string | null;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name?: string | null;
  role: string;
  isActive: boolean;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalDataSources: number;
  activeDataSources: number;
  totalSyncConfigs: number;
  activeSyncConfigs: number;
  totalSyncJobs: number;
  successfulJobs: number;
  failedJobs: number;
  runningJobs: number;
  recentJobs: SyncJob[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form types
export interface DataSourceFormData {
  name: string;
  description?: string;
  dbType: DatabaseType;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  sslEnabled: boolean;
}

export interface SyncConfigFormData {
  name: string;
  description?: string;
  dataSourceId: string;
  syncMode: SyncMode;
  scheduleType: ScheduleType;
  cronExpression?: string;
  outputPath: string;
  outputFileName: string;
  compressOutput: boolean;
  encryptOutput: boolean;
}

