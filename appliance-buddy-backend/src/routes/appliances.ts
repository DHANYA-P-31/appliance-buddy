import { Router } from 'express';
import { ApplianceController } from '../controllers/applianceController';

const router = Router();
const applianceController = new ApplianceController();

// Appliances routes
router.get('/stats', applianceController.getApplianceStats.bind(applianceController));
router.get('/', applianceController.getAllAppliances.bind(applianceController));
router.get('/:id', applianceController.getApplianceById.bind(applianceController));
router.post('/', applianceController.createAppliance.bind(applianceController));
router.put('/:id', applianceController.updateAppliance.bind(applianceController));
router.delete('/:id', applianceController.deleteAppliance.bind(applianceController));

export default router;