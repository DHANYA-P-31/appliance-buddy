import { Request, Response } from 'express';
import { ApplianceService } from '../services/applianceService';
import { getWarrantyStatus } from '../utils/dateUtils';

const applianceService = new ApplianceService();

export class ApplianceController {
  // GET /api/appliances
  async getAllAppliances(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        search: req.query.search as string,
        brand: req.query.brand as string,
        warrantyStatus: req.query.warrantyStatus as any,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
      };

      const appliances = await applianceService.getAllAppliances(filters);
      
      // Add warranty information to response
      const appliancesWithWarranty = appliances.map(appliance => ({
        ...appliance,
        warrantyStatus: getWarrantyStatus(appliance.purchaseDate, appliance.warrantyDurationMonths),
        warrantyEndDate: new Date(appliance.purchaseDate.getTime() + (appliance.warrantyDurationMonths * 30.44 * 24 * 60 * 60 * 1000)).toISOString(),
      }));

      res.json(appliancesWithWarranty);
    } catch (error) {
      console.error('Error fetching appliances:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // GET /api/appliances/:id
  async getApplianceById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const appliance = await applianceService.getApplianceById(id);

      if (!appliance) {
        res.status(404).json({ error: 'Appliance not found' });
        return;
      }

      const applianceWithWarranty = {
        ...appliance,
        warrantyStatus: getWarrantyStatus(appliance.purchaseDate, appliance.warrantyDurationMonths),
        warrantyEndDate: new Date(appliance.purchaseDate.getTime() + (appliance.warrantyDurationMonths * 30.44 * 24 * 60 * 60 * 1000)).toISOString(),
      };

      res.json(applianceWithWarranty);
    } catch (error) {
      console.error('Error fetching appliance:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // POST /api/appliances
  async createAppliance(req: Request, res: Response): Promise<void> {
    try {
      const appliance = await applianceService.createAppliance(req.body);
      res.status(201).json(appliance);
    } catch (error) {
      console.error('Error creating appliance:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // PUT /api/appliances/:id
  async updateAppliance(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const appliance = await applianceService.updateAppliance(id, req.body);

      if (!appliance) {
        res.status(404).json({ error: 'Appliance not found' });
        return;
      }

      res.json(appliance);
    } catch (error) {
      console.error('Error updating appliance:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // DELETE /api/appliances/:id
  async deleteAppliance(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await applianceService.deleteAppliance(id);

      if (!deleted) {
        res.status(404).json({ error: 'Appliance not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting appliance:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // GET /api/appliances/stats
  async getApplianceStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await applianceService.getApplianceStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}