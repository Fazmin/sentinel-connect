// API client for SentinelConnect

import type { 
  DataSource, 
  SyncConfig, 
  SyncJob, 
  DashboardStats,
  ApiResponse,
  DataSourceFormData,
  SyncConfigFormData,
  AuditLog,
  TableConfig
} from '@/types';

const BASE_URL = '/api';

async function fetchApi<T>(
  endpoint: string, 
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error || 'Request failed' };
    }
    
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Dashboard
export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  return fetchApi<DashboardStats>('/dashboard/stats');
}

// Data Sources
export async function getDataSources(): Promise<ApiResponse<DataSource[]>> {
  return fetchApi<DataSource[]>('/data-sources');
}

export async function getDataSource(id: string): Promise<ApiResponse<DataSource>> {
  return fetchApi<DataSource>(`/data-sources/${id}`);
}

export async function createDataSource(data: DataSourceFormData): Promise<ApiResponse<DataSource>> {
  return fetchApi<DataSource>('/data-sources', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateDataSource(id: string, data: Partial<DataSourceFormData>): Promise<ApiResponse<DataSource>> {
  return fetchApi<DataSource>(`/data-sources/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteDataSource(id: string): Promise<ApiResponse<void>> {
  return fetchApi<void>(`/data-sources/${id}`, {
    method: 'DELETE',
  });
}

export async function testDataSourceConnection(id: string): Promise<ApiResponse<{ status: string; message: string }>> {
  return fetchApi<{ status: string; message: string }>(`/data-sources/${id}/test`);
}

export async function getDataSourceTables(id: string): Promise<ApiResponse<{ schema: string; table: string; columns: { name: string; type: string }[] }[]>> {
  return fetchApi(`/data-sources/${id}/tables`);
}

// Sync Configs
export async function getSyncConfigs(): Promise<ApiResponse<SyncConfig[]>> {
  return fetchApi<SyncConfig[]>('/sync-configs');
}

export async function getSyncConfig(id: string): Promise<ApiResponse<SyncConfig>> {
  return fetchApi<SyncConfig>(`/sync-configs/${id}`);
}

export async function createSyncConfig(data: SyncConfigFormData): Promise<ApiResponse<SyncConfig>> {
  return fetchApi<SyncConfig>('/sync-configs', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateSyncConfig(id: string, data: Partial<SyncConfigFormData>): Promise<ApiResponse<SyncConfig>> {
  return fetchApi<SyncConfig>(`/sync-configs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteSyncConfig(id: string): Promise<ApiResponse<void>> {
  return fetchApi<void>(`/sync-configs/${id}`, {
    method: 'DELETE',
  });
}

// Table Configs
export async function updateTableConfigs(syncConfigId: string, tables: Partial<TableConfig>[]): Promise<ApiResponse<TableConfig[]>> {
  return fetchApi<TableConfig[]>(`/sync-configs/${syncConfigId}/tables`, {
    method: 'PUT',
    body: JSON.stringify({ tables }),
  });
}

// Sync Jobs
export async function getSyncJobs(syncConfigId?: string): Promise<ApiResponse<SyncJob[]>> {
  const query = syncConfigId ? `?syncConfigId=${syncConfigId}` : '';
  return fetchApi<SyncJob[]>(`/sync-jobs${query}`);
}

export async function getSyncJob(id: string): Promise<ApiResponse<SyncJob>> {
  return fetchApi<SyncJob>(`/sync-jobs/${id}`);
}

export async function triggerSync(syncConfigId: string): Promise<ApiResponse<SyncJob>> {
  return fetchApi<SyncJob>(`/sync-configs/${syncConfigId}/run`, {
    method: 'POST',
  });
}

export async function cancelSyncJob(id: string): Promise<ApiResponse<SyncJob>> {
  return fetchApi<SyncJob>(`/sync-jobs/${id}/cancel`, {
    method: 'POST',
  });
}

// Audit Logs
export async function getAuditLogs(params?: {
  resourceType?: string;
  resourceId?: string;
  limit?: number;
}): Promise<ApiResponse<AuditLog[]>> {
  const queryParams = new URLSearchParams();
  if (params?.resourceType) queryParams.set('resourceType', params.resourceType);
  if (params?.resourceId) queryParams.set('resourceId', params.resourceId);
  if (params?.limit) queryParams.set('limit', params.limit.toString());
  
  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return fetchApi<AuditLog[]>(`/audit-logs${query}`);
}

// Downloads
export function getDownloadUrl(jobId: string): string {
  return `${BASE_URL}/downloads/${jobId}`;
}

