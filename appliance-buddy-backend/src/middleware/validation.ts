import { Request, Response, NextFunction } from 'express';
import { 
  CreateApplianceSchema, 
  UpdateApplianceSchema,
  CreateMaintenanceTaskSchema,
  UpdateMaintenanceTaskSchema,
  CreateSupportContactSchema,
  UpdateSupportContactSchema,
  CreateLinkedDocumentSchema,
  UpdateLinkedDocumentSchema
} from '../utils/validators';

export const validateAppliance = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = CreateApplianceSchema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export const validateApplianceUpdate = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = UpdateApplianceSchema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export const validateMaintenanceTask = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = CreateMaintenanceTaskSchema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export const validateMaintenanceTaskUpdate = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = UpdateMaintenanceTaskSchema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export const validateSupportContact = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = CreateSupportContactSchema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export const validateSupportContactUpdate = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = UpdateSupportContactSchema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export const validateLinkedDocument = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = CreateLinkedDocumentSchema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export const validateLinkedDocumentUpdate = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = UpdateLinkedDocumentSchema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
};