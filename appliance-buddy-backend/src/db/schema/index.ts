import { relations } from 'drizzle-orm';

// Import all tables
export { appliances } from './appliances';
export { supportContacts } from './supportContacts';
export { maintenanceTasks } from './maintenanceTasks';
export { linkedDocuments } from './linkedDocuments';

// Import the table definitions for relations
import { appliances } from './appliances';
import { supportContacts } from './supportContacts';
import { maintenanceTasks } from './maintenanceTasks';
import { linkedDocuments } from './linkedDocuments';

// Define relations
export const appliancesRelations = relations(appliances, ({ many }) => ({
  supportContacts: many(supportContacts),
  maintenanceTasks: many(maintenanceTasks),
  linkedDocuments: many(linkedDocuments),
}));

export const supportContactsRelations = relations(supportContacts, ({ one }) => ({
  appliance: one(appliances, {
    fields: [supportContacts.applianceId],
    references: [appliances.id],
  }),
}));

export const maintenanceTasksRelations = relations(maintenanceTasks, ({ one }) => ({
  appliance: one(appliances, {
    fields: [maintenanceTasks.applianceId],
    references: [appliances.id],
  }),
}));

export const linkedDocumentsRelations = relations(linkedDocuments, ({ one }) => ({
  appliance: one(appliances, {
    fields: [linkedDocuments.applianceId],
    references: [appliances.id],
  }),
}));