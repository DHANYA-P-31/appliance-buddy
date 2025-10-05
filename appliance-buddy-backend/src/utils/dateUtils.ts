import { WarrantyStatus, MaintenanceStatus } from '../types';

/**
 * Calculate warranty end date
 */
export const calculateWarrantyEndDate = (purchaseDate: Date, warrantyDurationMonths: number): Date => {
  const endDate = new Date(purchaseDate);
  endDate.setMonth(endDate.getMonth() + warrantyDurationMonths);
  return endDate;
};

/**
 * Get warranty status based on purchase date and duration
 */
export const getWarrantyStatus = (purchaseDate: Date, warrantyDurationMonths: number): WarrantyStatus => {
  const now = new Date();
  const warrantyEndDate = calculateWarrantyEndDate(purchaseDate, warrantyDurationMonths);
  const daysUntilExpiry = Math.ceil((warrantyEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0) {
    return 'Expired';
  } else if (daysUntilExpiry <= 30) {
    return 'Expiring Soon';
  } else {
    return 'Active';
  }
};

/**
 * Get maintenance task status based on scheduled and completed dates
 */
export const getMaintenanceStatus = (scheduledDate: Date, completedDate?: Date): MaintenanceStatus => {
  if (completedDate) {
    return 'Completed';
  }
  
  const now = new Date();
  if (scheduledDate < now) {
    return 'Overdue';
  }
  
  return 'Upcoming';
};

/**
 * Format date to ISO string for API responses
 */
export const formatDateToISO = (date: Date): string => {
  return date.toISOString();
};

/**
 * Parse ISO string to Date object
 */
export const parseISOToDate = (dateString: string): Date => {
  return new Date(dateString);
};

/**
 * Check if a date string is valid
 */
export const isValidDateString = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};