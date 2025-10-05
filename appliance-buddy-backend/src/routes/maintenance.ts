import { Router } from 'express';
import { MaintenanceController } from '../controllers/maintenanceController';

const router = Router();
const maintenanceController = new MaintenanceController();

// Maintenance routes
router.get('/upcoming', maintenanceController.getUpcomingTasks.bind(maintenanceController));
router.get('/overdue', maintenanceController.getOverdueTasks.bind(maintenanceController));
router.put('/:taskId', maintenanceController.updateMaintenanceTask.bind(maintenanceController));
router.delete('/:taskId', maintenanceController.deleteMaintenanceTask.bind(maintenanceController));
router.post('/:taskId/complete', maintenanceController.completeMaintenanceTask.bind(maintenanceController));

export default router;