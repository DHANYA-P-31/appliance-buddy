import { Request, Response } from 'express';
import { MaintenanceService } from '../services/maintenanceService';

const maintenanceService = new MaintenanceService();

export class MaintenanceController {
  // GET /api/appliances/:id/maintenance
  async getMaintenanceTasksForAppliance(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const tasks = await maintenanceService.getMaintenanceTasksForAppliance(id);
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching maintenance tasks:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // POST /api/appliances/:id/maintenance
  async createMaintenanceTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const task = await maintenanceService.createMaintenanceTask(id, req.body);
      res.status(201).json(task);
    } catch (error) {
      console.error('Error creating maintenance task:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // PUT /api/maintenance/:taskId
  async updateMaintenanceTask(req: Request, res: Response): Promise<void> {
    try {
      const { taskId } = req.params;
      const task = await maintenanceService.updateMaintenanceTask(taskId, req.body);

      if (!task) {
        res.status(404).json({ error: 'Maintenance task not found' });
        return;
      }

      res.json(task);
    } catch (error) {
      console.error('Error updating maintenance task:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // DELETE /api/maintenance/:taskId
  async deleteMaintenanceTask(req: Request, res: Response): Promise<void> {
    try {
      const { taskId } = req.params;
      const deleted = await maintenanceService.deleteMaintenanceTask(taskId);

      if (!deleted) {
        res.status(404).json({ error: 'Maintenance task not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting maintenance task:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // POST /api/maintenance/:taskId/complete
  async completeMaintenanceTask(req: Request, res: Response): Promise<void> {
    try {
      const { taskId } = req.params;
      const { completedDate } = req.body;
      
      const task = await maintenanceService.completeMaintenanceTask(
        taskId, 
        completedDate ? new Date(completedDate) : undefined
      );

      if (!task) {
        res.status(404).json({ error: 'Maintenance task not found' });
        return;
      }

      res.json(task);
    } catch (error) {
      console.error('Error completing maintenance task:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // GET /api/maintenance/upcoming
  async getUpcomingTasks(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await maintenanceService.getUpcomingTasks();
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching upcoming tasks:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // GET /api/maintenance/overdue
  async getOverdueTasks(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await maintenanceService.getOverdueTasks();
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching overdue tasks:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}