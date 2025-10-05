import { Router } from 'express';
import { MaintenanceController } from '../controllers/maintenanceController';
import applianceRoutes from './appliances';
import maintenanceRoutes from './maintenance';

const router = Router();
const maintenanceController = new MaintenanceController();

// Mount sub-routes
router.use('/appliances', applianceRoutes);
router.use('/maintenance', maintenanceRoutes);

// Appliance-specific maintenance routes
router.get('/appliances/:id/maintenance', maintenanceController.getMaintenanceTasksForAppliance.bind(maintenanceController));
router.post('/appliances/:id/maintenance', maintenanceController.createMaintenanceTask.bind(maintenanceController));

export default router;