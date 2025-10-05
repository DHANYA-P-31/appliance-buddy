import { eq, ilike, desc, or } from 'drizzle-orm';
import { db } from '../config/database';
import { appliances, supportContacts, maintenanceTasks, linkedDocuments } from '../db/schema';
import { 
  CreateApplianceRequest, 
  UpdateApplianceRequest,
  ApplianceFilters,
  ApplianceStats,
  WarrantyStatus,
  ApplianceWithRelations
} from '../types';
import { getWarrantyStatus } from '../utils/dateUtils';

export class ApplianceService {
  /**
   * Get all appliances with optional filtering
   */
  async getAllAppliances(filters?: ApplianceFilters): Promise<any[]> {
    // Simple query without complex where chaining
    const applianceResults = await db
      .select()
      .from(appliances)
      .orderBy(desc(appliances.createdAt));

    // Get related data for each appliance
    const appliancesWithRelations = [];
    
    for (const appliance of applianceResults) {
      const [contacts, tasks, documents] = await Promise.all([
        db.select().from(supportContacts).where(eq(supportContacts.applianceId, appliance.id)),
        db.select().from(maintenanceTasks).where(eq(maintenanceTasks.applianceId, appliance.id)),
        db.select().from(linkedDocuments).where(eq(linkedDocuments.applianceId, appliance.id))
      ]);

      const processedAppliance = {
        ...appliance,
        serialNumber: appliance.serialNumber || undefined,
        purchaseLocation: appliance.purchaseLocation || undefined,
        notes: appliance.notes || undefined,
        supportContacts: contacts.map(contact => ({
          ...contact,
          company: contact.company || undefined,
          phone: contact.phone || undefined,
          email: contact.email || undefined,
          website: contact.website || undefined,
          notes: contact.notes || undefined,
        })),
        maintenanceTasks: tasks.map(task => ({
          ...task,
          serviceProvider: task.serviceProvider as any,
          notes: task.notes || undefined,
          completedDate: task.completedDate || undefined,
        })),
        linkedDocuments: documents
      };

      // Apply filters in memory for now
      let includeAppliance = true;

      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        includeAppliance = 
          appliance.name.toLowerCase().includes(searchTerm) ||
          appliance.brand.toLowerCase().includes(searchTerm) ||
          appliance.model.toLowerCase().includes(searchTerm);
      }

      if (includeAppliance && filters?.brand) {
        includeAppliance = appliance.brand === filters.brand;
      }

      if (includeAppliance && filters?.warrantyStatus) {
        const warrantyStatus = getWarrantyStatus(appliance.purchaseDate, appliance.warrantyDurationMonths);
        includeAppliance = warrantyStatus === filters.warrantyStatus;
      }

      if (includeAppliance) {
        appliancesWithRelations.push(processedAppliance);
      }
    }

    // Apply pagination
    let result = appliancesWithRelations;
    if (filters?.offset) {
      result = result.slice(filters.offset);
    }
    if (filters?.limit) {
      result = result.slice(0, filters.limit);
    }

    return result;
  }

  /**
   * Get single appliance by ID with all relations
   */
  async getApplianceById(id: string): Promise<any | null> {
    const applianceResult = await db
      .select()
      .from(appliances)
      .where(eq(appliances.id, id))
      .limit(1);

    if (applianceResult.length === 0) {
      return null;
    }

    const appliance = applianceResult[0];

    // Get all related data
    const [contacts, tasks, documents] = await Promise.all([
      db.select().from(supportContacts).where(eq(supportContacts.applianceId, id)),
      db.select().from(maintenanceTasks).where(eq(maintenanceTasks.applianceId, id)),
      db.select().from(linkedDocuments).where(eq(linkedDocuments.applianceId, id))
    ]);

    return {
      ...appliance,
      serialNumber: appliance.serialNumber || undefined,
      purchaseLocation: appliance.purchaseLocation || undefined,
      notes: appliance.notes || undefined,
      supportContacts: contacts.map(contact => ({
        ...contact,
        company: contact.company || undefined,
        phone: contact.phone || undefined,
        email: contact.email || undefined,
        website: contact.website || undefined,
        notes: contact.notes || undefined,
      })),
      maintenanceTasks: tasks.map(task => ({
        ...task,
        serviceProvider: task.serviceProvider as any,
        notes: task.notes || undefined,
        completedDate: task.completedDate || undefined,
      })),
      linkedDocuments: documents
    };
  }

  /**
   * Create new appliance
   */
  async createAppliance(data: CreateApplianceRequest): Promise<any> {
    const newAppliance = {
      name: data.name,
      brand: data.brand,
      model: data.model,
      purchaseDate: new Date(data.purchaseDate),
      warrantyDurationMonths: data.warrantyDurationMonths,
      serialNumber: data.serialNumber || null,
      purchaseLocation: data.purchaseLocation || null,
      notes: data.notes || null,
    };

    const result = await db
      .insert(appliances)
      .values(newAppliance)
      .returning();

    const created = result[0];
    return {
      ...created,
      serialNumber: created.serialNumber || undefined,
      purchaseLocation: created.purchaseLocation || undefined,
      notes: created.notes || undefined,
    };
  }

  /**
   * Update existing appliance
   */
  async updateAppliance(id: string, data: UpdateApplianceRequest): Promise<any | null> {
    const updateData: any = { updatedAt: new Date() };

    // Only include defined fields
    if (data.name !== undefined) updateData.name = data.name;
    if (data.brand !== undefined) updateData.brand = data.brand;
    if (data.model !== undefined) updateData.model = data.model;
    if (data.purchaseDate !== undefined) updateData.purchaseDate = new Date(data.purchaseDate);
    if (data.warrantyDurationMonths !== undefined) updateData.warrantyDurationMonths = data.warrantyDurationMonths;
    if (data.serialNumber !== undefined) updateData.serialNumber = data.serialNumber || null;
    if (data.purchaseLocation !== undefined) updateData.purchaseLocation = data.purchaseLocation || null;
    if (data.notes !== undefined) updateData.notes = data.notes || null;

    const result = await db
      .update(appliances)
      .set(updateData)
      .where(eq(appliances.id, id))
      .returning();

    if (result.length === 0) return null;

    const updated = result[0];
    return {
      ...updated,
      serialNumber: updated.serialNumber || undefined,
      purchaseLocation: updated.purchaseLocation || undefined,
      notes: updated.notes || undefined,
    };
  }

  /**
   * Delete appliance and all related data
   */
  async deleteAppliance(id: string): Promise<boolean> {
    const result = await db
      .delete(appliances)
      .where(eq(appliances.id, id))
      .returning();

    return result.length > 0;
  }

  /**
   * Get appliance statistics
   */
  async getApplianceStats(): Promise<ApplianceStats> {
    const allAppliances = await db.select().from(appliances);
    
    const stats = allAppliances.reduce(
      (acc, appliance) => {
        acc.total++;
        const warrantyStatus = getWarrantyStatus(appliance.purchaseDate, appliance.warrantyDurationMonths);
        
        switch (warrantyStatus) {
          case 'Active':
            acc.active++;
            break;
          case 'Expiring Soon':
            acc.expiring++;
            break;
          case 'Expired':
            acc.expired++;
            break;
        }
        
        return acc;
      },
      { total: 0, active: 0, expiring: 0, expired: 0 }
    );

    return stats;
  }

  /**
   * Search appliances by query
   */
  async searchAppliances(query: string): Promise<any[]> {
    return this.getAllAppliances({ search: query });
  }

  /**
   * Get appliances by warranty status
   */
  async getAppliancesByWarrantyStatus(status: WarrantyStatus): Promise<any[]> {
    return this.getAllAppliances({ warrantyStatus: status });
  }
}