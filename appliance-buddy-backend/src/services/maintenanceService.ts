import { eq, lt, desc } from 'drizzle-orm';
import { db } from '../config/database';
import { maintenanceTasks } from '../db/schema';
import {
  CreateMaintenanceTaskRequest,
  UpdateMaintenanceTaskRequest,
  MaintenanceStatus
} from '../types';
import { getMaintenanceStatus } from '../utils/dateUtils';

export class MaintenanceService {
  /**
   * Get maintenance tasks for a specific appliance
   */
  async getMaintenanceTasksForAppliance(applianceId: string): Promise<any[]> {
    const tasks = await db
      .select()
      .from(maintenanceTasks)
      .where(eq(maintenanceTasks.applianceId, applianceId))
      .orderBy(desc(maintenanceTasks.scheduledDate));

    return tasks.map(task => ({
      ...task,
      serviceProvider: task.serviceProvider as any,
      notes: task.notes || undefined,
      completedDate: task.completedDate || undefined,
    }));
  }

  /**
   * Create new maintenance task
   */
  async createMaintenanceTask(applianceId: string, data: CreateMaintenanceTaskRequest): Promise<any> {
    const scheduledDate = new Date(data.scheduledDate);
    const status = getMaintenanceStatus(scheduledDate);

    const newTask = {
      applianceId,
      taskName: data.taskName,
      scheduledDate,
      frequency: data.frequency,
      serviceProvider: data.serviceProvider ? JSON.stringify(data.serviceProvider) : null,
      notes: data.notes || null,
      status,
      completedDate: null,
    };

    const result = await db
      .insert(maintenanceTasks)
      .values(newTask)
      .returning();

    const created = result[0];
    return {
      ...created,
      serviceProvider: created.serviceProvider as any,
      notes: created.notes || undefined,
      completedDate: created.completedDate || undefined,
    };
  }

  /**
   * Update maintenance task
   */
  async updateMaintenanceTask(id: string, data: UpdateMaintenanceTaskRequest): Promise<any | null> {
    const updateData: any = { updatedAt: new Date() };

    if (data.taskName !== undefined) updateData.taskName = data.taskName;
    if (data.scheduledDate !== undefined) {
      updateData.scheduledDate = new Date(data.scheduledDate);
      // Recalculate status if date changed and not manually set
      if (data.status === undefined) {
        updateData.status = getMaintenanceStatus(new Date(data.scheduledDate), data.completedDate ? new Date(data.completedDate) : undefined);
      }
    }
    if (data.frequency !== undefined) updateData.frequency = data.frequency;
    if (data.serviceProvider !== undefined) {
      updateData.serviceProvider = data.serviceProvider ? JSON.stringify(data.serviceProvider) : null;
    }
    if (data.notes !== undefined) updateData.notes = data.notes || null;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.completedDate !== undefined) {
      updateData.completedDate = data.completedDate ? new Date(data.completedDate) : null;
    }

    const result = await db
      .update(maintenanceTasks)
      .set(updateData)
      .where(eq(maintenanceTasks.id, id))
      .returning();

    if (result.length === 0) return null;

    const updated = result[0];
    return {
      ...updated,
      serviceProvider: updated.serviceProvider as any,
      notes: updated.notes || undefined,
      completedDate: updated.completedDate || undefined,
    };
  }

  /**
   * Delete maintenance task
   */
  async deleteMaintenanceTask(id: string): Promise<boolean> {
    const result = await db
      .delete(maintenanceTasks)
      .where(eq(maintenanceTasks.id, id))
      .returning();

    return result.length > 0;
  }

  /**
   * Mark maintenance task as completed
   */
  async completeMaintenanceTask(id: string, completedDate?: Date): Promise<any | null> {
    const completionDate = completedDate || new Date();
    
    const result = await db
      .update(maintenanceTasks)
      .set({
        status: 'Completed',
        completedDate: completionDate,
        updatedAt: new Date(),
      })
      .where(eq(maintenanceTasks.id, id))
      .returning();

    if (result.length === 0) return null;

    const updated = result[0];
    return {
      ...updated,
      serviceProvider: updated.serviceProvider as any,
      notes: updated.notes || undefined,
      completedDate: updated.completedDate || undefined,
    };
  }

  /**
   * Get all upcoming maintenance tasks across all appliances
   */
  async getUpcomingTasks(): Promise<any[]> {
    const tasks = await db
      .select()
      .from(maintenanceTasks)
      .where(eq(maintenanceTasks.status, 'Upcoming'))
      .orderBy(maintenanceTasks.scheduledDate);

    return tasks.map(task => ({
      ...task,
      serviceProvider: task.serviceProvider as any,
      notes: task.notes || undefined,
      completedDate: task.completedDate || undefined,
    }));
  }

  /**
   * Get all overdue maintenance tasks
   */
  async getOverdueTasks(): Promise<any[]> {
    const tasks = await db
      .select()
      .from(maintenanceTasks)
      .where(eq(maintenanceTasks.status, 'Overdue'))
      .orderBy(maintenanceTasks.scheduledDate);

    return tasks.map(task => ({
      ...task,
      serviceProvider: task.serviceProvider as any,
      notes: task.notes || undefined,
      completedDate: task.completedDate || undefined,
    }));
  }

  /**
   * Update task statuses based on current date
   * This should be run periodically as a background job
   */
  async updateTaskStatuses(): Promise<void> {
    const allTasks = await db
      .select()
      .from(maintenanceTasks)
      .where(eq(maintenanceTasks.status, 'Upcoming'));

    const now = new Date();
    const tasksToUpdate = allTasks.filter(task => 
      task.scheduledDate < now && !task.completedDate
    );

    for (const task of tasksToUpdate) {
      await db
        .update(maintenanceTasks)
        .set({
          status: 'Overdue',
          updatedAt: new Date(),
        })
        .where(eq(maintenanceTasks.id, task.id));
    }
  }
}