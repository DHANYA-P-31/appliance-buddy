import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const appliances = sqliteTable('appliances', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  brand: text('brand').notNull(),
  model: text('model').notNull(),
  purchaseDate: integer('purchase_date', { mode: 'timestamp' }).notNull(),
  warrantyDurationMonths: integer('warranty_duration_months').notNull(),
  serialNumber: text('serial_number'),
  purchaseLocation: text('purchase_location'),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
}, (table) => ({
  brandIdx: index('brand_idx').on(table.brand),
  nameIdx: index('name_idx').on(table.name),
}));

export const supportContacts = sqliteTable('support_contacts', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  applianceId: text('appliance_id').references(() => appliances.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  company: text('company'),
  phone: text('phone'),
  email: text('email'),
  website: text('website'),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export const maintenanceTasks = sqliteTable('maintenance_tasks', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  applianceId: text('appliance_id').references(() => appliances.id, { onDelete: 'cascade' }).notNull(),
  taskName: text('task_name').notNull(),
  scheduledDate: integer('scheduled_date', { mode: 'timestamp' }).notNull(),
  frequency: text('frequency').notNull(), // 'One-time', 'Monthly', 'Yearly', 'Custom'
  serviceProviderName: text('service_provider_name'),
  serviceProviderPhone: text('service_provider_phone'),
  serviceProviderEmail: text('service_provider_email'),
  serviceProviderNotes: text('service_provider_notes'),
  notes: text('notes'),
  status: text('status').notNull(), // 'Upcoming', 'Completed', 'Overdue'
  completedDate: integer('completed_date', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
}, (table) => ({
  applianceIdx: index('appliance_idx').on(table.applianceId),
  scheduledDateIdx: index('scheduled_date_idx').on(table.scheduledDate),
  statusIdx: index('status_idx').on(table.status),
}));

export const linkedDocuments = sqliteTable('linked_documents', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  applianceId: text('appliance_id').references(() => appliances.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  url: text('url').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

// Relations
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