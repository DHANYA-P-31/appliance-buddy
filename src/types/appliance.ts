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
  supportContacts: SupportContact[];
  maintenanceTasks: MaintenanceTask[];
  linkedDocuments: LinkedDocument[];
}

export interface SupportContact {
  id: string;
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
  frequency: 'One-time' | 'Monthly' | 'Yearly' | 'Custom';
  serviceProvider?: {
    name: string;
    phone?: string;
    email?: string;
    notes?: string;
  };
  notes?: string;
  status: 'Upcoming' | 'Completed' | 'Overdue';
  completedDate?: Date;
}

export interface LinkedDocument {
  id: string;
  title: string;
  url: string;
}

export type WarrantyStatus = 'Active' | 'Expiring Soon' | 'Expired';