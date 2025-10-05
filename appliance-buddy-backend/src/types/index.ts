// Base types matching frontend interfaces
export type WarrantyStatus = 'Active' | 'Expiring Soon' | 'Expired';
export type MaintenanceStatus = 'Upcoming' | 'Completed' | 'Overdue';
export type MaintenanceFrequency = 'One-time' | 'Monthly' | 'Yearly' | 'Custom';

// Database entity types (inferred from Drizzle schemas)
export interface Appliance {
  id: string;
  name: string;
  brand: string;
  model: string;
  purchaseDate: Date;
  warrantyDurationMonths: number;
  serialNumber?: string;
  purchaseLocation?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupportContact {
  id: string;
  applianceId: string;
  name: string;
  company?: string;
  phone?: string;
  email?: string;
  website?: string;
  notes?: string;
}

export interface MaintenanceTask {
  id: string;
  applianceId: string;
  taskName: string;
  scheduledDate: Date;
  frequency: MaintenanceFrequency;
  serviceProvider?: {
    name: string;
    phone?: string;
    email?: string;
    notes?: string;
  };
  notes?: string;
  status: MaintenanceStatus;
  completedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LinkedDocument {
  id: string;
  applianceId: string;
  title: string;
  url: string;
}

// Complete appliance with relations
export interface ApplianceWithRelations extends Appliance {
  supportContacts: SupportContact[];
  maintenanceTasks: MaintenanceTask[];
  linkedDocuments: LinkedDocument[];
}

// Request/Response types
export interface CreateApplianceRequest {
  name: string;
  brand: string;
  model: string;
  purchaseDate: string;
  warrantyDurationMonths: number;
  serialNumber?: string;
  purchaseLocation?: string;
  notes?: string;
}

export interface UpdateApplianceRequest extends Partial<CreateApplianceRequest> {}

export interface CreateMaintenanceTaskRequest {
  taskName: string;
  scheduledDate: string;
  frequency: MaintenanceFrequency;
  serviceProvider?: {
    name: string;
    phone?: string;
    email?: string;
    notes?: string;
  };
  notes?: string;
}

export interface UpdateMaintenanceTaskRequest extends Partial<CreateMaintenanceTaskRequest> {
  status?: MaintenanceStatus;
  completedDate?: string;
}

export interface CreateSupportContactRequest {
  name: string;
  company?: string;
  phone?: string;
  email?: string;
  website?: string;
  notes?: string;
}

export interface CreateLinkedDocumentRequest {
  title: string;
  url: string;
}

// Filter types
export interface ApplianceFilters {
  warrantyStatus?: WarrantyStatus;
  search?: string;
  brand?: string;
  limit?: number;
  offset?: number;
}

// Stats types
export interface ApplianceStats {
  total: number;
  active: number;
  expiring: number;
  expired: number;
}

// API Response types
export interface ApplianceResponse extends Appliance {
  warrantyStatus: WarrantyStatus;
  warrantyEndDate: string;
  supportContacts: SupportContact[];
  maintenanceTasks: MaintenanceTask[];
  linkedDocuments: LinkedDocument[];
}