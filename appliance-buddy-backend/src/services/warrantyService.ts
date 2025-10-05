import { db } from '../config/database';
import { appliances } from '../db/schema/index';
import { WarrantyStatus } from '../types';
import { calculateWarrantyEndDate, getWarrantyStatus } from '../utils/dateUtils';

export class WarrantyService {
  static calculateWarrantyEndDate(purchaseDate: Date, durationMonths: number): Date {
    return calculateWarrantyEndDate(purchaseDate, durationMonths);
  }

  static getWarrantyStatus(purchaseDate: Date, durationMonths: number): WarrantyStatus {
    return getWarrantyStatus(purchaseDate, durationMonths);
  }

  static async getExpiringWarranties(days: number = 30): Promise<any[]> {
    const allAppliances = await db.select().from(appliances);
    const now = new Date();
    const expirationThreshold = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));

    return allAppliances.filter(appliance => {
      const warrantyEndDate = calculateWarrantyEndDate(appliance.purchaseDate, appliance.warrantyDurationMonths);
      return warrantyEndDate > now && warrantyEndDate <= expirationThreshold;
    });
  }

  static async getExpiredWarranties(): Promise<any[]> {
    const allAppliances = await db.select().from(appliances);
    const now = new Date();

    return allAppliances.filter(appliance => {
      const warrantyEndDate = calculateWarrantyEndDate(appliance.purchaseDate, appliance.warrantyDurationMonths);
      return warrantyEndDate < now;
    });
  }
}