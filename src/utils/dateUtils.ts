import { addMonths, isAfter, isBefore, differenceInDays } from 'date-fns';
import { WarrantyStatus } from '@/types/appliance';

export const calculateWarrantyEndDate = (purchaseDate: Date, warrantyDurationMonths: number): Date => {
  return addMonths(purchaseDate, warrantyDurationMonths);
};

export const getWarrantyStatus = (purchaseDate: Date, warrantyDurationMonths: number): WarrantyStatus => {
  const now = new Date();
  const warrantyEndDate = calculateWarrantyEndDate(purchaseDate, warrantyDurationMonths);
  const daysUntilExpiry = differenceInDays(warrantyEndDate, now);

  if (isAfter(now, warrantyEndDate)) {
    return 'Expired';
  } else if (daysUntilExpiry <= 30) {
    return 'Expiring Soon';
  } else {
    return 'Active';
  }
};

export const getMaintenanceStatus = (scheduledDate: Date, completedDate?: Date) => {
  if (completedDate) {
    return 'Completed';
  }
  
  const now = new Date();
  if (isBefore(scheduledDate, now)) {
    return 'Overdue';
  }
  
  return 'Upcoming';
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};