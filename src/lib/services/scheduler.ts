import cron, { ScheduledTask } from 'node-cron';
import prisma from '../db';
import { executeSync } from './sync-executor';

// Store active scheduled tasks
const scheduledTasks = new Map<string, ScheduledTask>();

// Lock to prevent concurrent syncs of the same config
const runningJobs = new Set<string>();

/**
 * Get cron expression from schedule type
 */
function getCronExpression(scheduleType: string, cronExpression?: string | null): string | null {
  switch (scheduleType) {
    case 'hourly':
      return '0 * * * *'; // Every hour at minute 0
    case 'daily':
      return '0 0 * * *'; // Every day at midnight
    case 'weekly':
      return '0 0 * * 0'; // Every Sunday at midnight
    case 'cron':
      return cronExpression || null;
    default:
      return null;
  }
}

/**
 * Schedule a sync configuration
 */
export function scheduleSync(config: {
  id: string;
  name: string;
  scheduleType: string;
  cronExpression?: string | null;
  isActive: boolean;
}): boolean {
  // Remove existing schedule if any
  unscheduleSync(config.id);

  // Don't schedule if not active or manual
  if (!config.isActive || config.scheduleType === 'manual') {
    return false;
  }

  const cronExpr = getCronExpression(config.scheduleType, config.cronExpression);
  if (!cronExpr) {
    console.warn(`Invalid schedule for config ${config.name}: ${config.scheduleType}`);
    return false;
  }

  // Validate cron expression
  if (!cron.validate(cronExpr)) {
    console.error(`Invalid cron expression for config ${config.name}: ${cronExpr}`);
    return false;
  }

  // Create scheduled task
  const task = cron.schedule(cronExpr, async () => {
    // Prevent concurrent runs
    if (runningJobs.has(config.id)) {
      console.log(`Skipping scheduled sync for ${config.name} - already running`);
      return;
    }

    console.log(`Starting scheduled sync for ${config.name}`);
    runningJobs.add(config.id);

    try {
      await executeSync(config.id, 'schedule');
      console.log(`Completed scheduled sync for ${config.name}`);
    } catch (error) {
      console.error(`Failed scheduled sync for ${config.name}:`, error);
    } finally {
      runningJobs.delete(config.id);
    }
  });

  scheduledTasks.set(config.id, task);
  console.log(`Scheduled sync for ${config.name} with cron: ${cronExpr}`);
  return true;
}

/**
 * Remove a scheduled sync
 */
export function unscheduleSync(configId: string): void {
  const task = scheduledTasks.get(configId);
  if (task) {
    task.stop();
    scheduledTasks.delete(configId);
    console.log(`Unscheduled sync for config ${configId}`);
  }
}

/**
 * Initialize all scheduled syncs from database
 */
export async function initializeScheduler(): Promise<void> {
  console.log('Initializing sync scheduler...');

  try {
    // Get all active scheduled configs
    const configs = await prisma.syncConfig.findMany({
      where: {
        isActive: true,
        scheduleType: { not: 'manual' },
      },
      select: {
        id: true,
        name: true,
        scheduleType: true,
        cronExpression: true,
        isActive: true,
      },
    });

    let scheduledCount = 0;
    for (const config of configs) {
      if (scheduleSync(config)) {
        scheduledCount++;
      }
    }

    console.log(`Scheduler initialized with ${scheduledCount} active schedules`);
  } catch (error) {
    console.error('Failed to initialize scheduler:', error);
  }
}

/**
 * Stop all scheduled tasks
 */
export function stopScheduler(): void {
  console.log('Stopping sync scheduler...');
  
  for (const [configId, task] of scheduledTasks) {
    task.stop();
  }
  
  scheduledTasks.clear();
  console.log('Scheduler stopped');
}

/**
 * Get status of all scheduled tasks
 */
export function getSchedulerStatus(): {
  totalScheduled: number;
  runningJobs: string[];
  schedules: { configId: string; running: boolean }[];
} {
  return {
    totalScheduled: scheduledTasks.size,
    runningJobs: Array.from(runningJobs),
    schedules: Array.from(scheduledTasks.keys()).map(configId => ({
      configId,
      running: runningJobs.has(configId),
    })),
  };
}

/**
 * Trigger immediate sync for a config
 */
export async function triggerImmediateSync(configId: string): Promise<string> {
  // Prevent concurrent runs
  if (runningJobs.has(configId)) {
    throw new Error('A sync job is already running for this configuration');
  }

  runningJobs.add(configId);

  try {
    const jobId = await executeSync(configId, 'manual');
    return jobId;
  } finally {
    runningJobs.delete(configId);
  }
}

