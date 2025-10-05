import { z } from 'zod';

export const CreateApplianceSchema = z.object({
  name: z.string().min(1).max(255),
  brand: z.string().min(1).max(100),
  model: z.string().min(1).max(100),
  purchaseDate: z.string().datetime().transform(str => new Date(str)),
  warrantyDurationMonths: z.number().int().min(1),
  serialNumber: z.string().max(100).optional(),
  purchaseLocation: z.string().max(255).optional(),
  notes: z.string().optional(),
  supportContacts: z.array(z.object({
    name: z.string().min(1).max(255),
    company: z.string().max(255).optional(),
    phone: z.string().max(20).optional(),
    email: z.string().email().optional(),
    website: z.string().url().optional(),
    notes: z.string().optional(),
  })).optional(),
  maintenanceTasks: z.array(z.object({
    taskName: z.string().min(1).max(255),
    scheduledDate: z.string().datetime().transform(str => new Date(str)),
    frequency: z.enum(['One-time', 'Monthly', 'Yearly', 'Custom']),
    serviceProvider: z.object({
      name: z.string().min(1),
      phone: z.string().optional(),
      email: z.string().email().optional(),
      notes: z.string().optional(),
    }).optional(),
    notes: z.string().optional(),
    status: z.enum(['Upcoming', 'Completed', 'Overdue']),
    completedDate: z.string().datetime().transform(str => new Date(str)).optional(),
  })).optional(),
  linkedDocuments: z.array(z.object({
    title: z.string().min(1).max(255),
    url: z.string().url().max(1000),
  })).optional(),
});

export const UpdateApplianceSchema = CreateApplianceSchema.partial();

export const CreateMaintenanceTaskSchema = z.object({
  applianceId: z.string().uuid(),
  taskName: z.string().min(1).max(255),
  scheduledDate: z.string().datetime().transform(str => new Date(str)),
  frequency: z.enum(['One-time', 'Monthly', 'Yearly', 'Custom']),
  serviceProvider: z.object({
    name: z.string().min(1),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    notes: z.string().optional(),
  }).optional(),
  notes: z.string().optional(),
  status: z.enum(['Upcoming', 'Completed', 'Overdue']).default('Upcoming'),
  completedDate: z.string().datetime().transform(str => new Date(str)).optional(),
});

export const UpdateMaintenanceTaskSchema = CreateMaintenanceTaskSchema.partial().omit({ applianceId: true });

export const CreateSupportContactSchema = z.object({
  applianceId: z.string().uuid(),
  name: z.string().min(1).max(255),
  company: z.string().max(255).optional(),
  phone: z.string().max(20).optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  notes: z.string().optional(),
});

export const UpdateSupportContactSchema = CreateSupportContactSchema.partial().omit({ applianceId: true });

export const CreateLinkedDocumentSchema = z.object({
  applianceId: z.string().uuid(),
  title: z.string().min(1).max(255),
  url: z.string().url().max(1000),
});

export const UpdateLinkedDocumentSchema = CreateLinkedDocumentSchema.partial().omit({ applianceId: true });

export type CreateApplianceType = z.infer<typeof CreateApplianceSchema>;
export type UpdateApplianceType = z.infer<typeof UpdateApplianceSchema>;
export type CreateMaintenanceTaskType = z.infer<typeof CreateMaintenanceTaskSchema>;
export type UpdateMaintenanceTaskType = z.infer<typeof UpdateMaintenanceTaskSchema>;
export type CreateSupportContactType = z.infer<typeof CreateSupportContactSchema>;
export type UpdateSupportContactType = z.infer<typeof UpdateSupportContactSchema>;
export type CreateLinkedDocumentType = z.infer<typeof CreateLinkedDocumentSchema>;
export type UpdateLinkedDocumentType = z.infer<typeof UpdateLinkedDocumentSchema>;