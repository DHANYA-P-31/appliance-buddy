import { pgTable, uuid, varchar, text, timestamp, json } from 'drizzle-orm/pg-core';
import { appliances } from './appliances';

export const maintenanceTasks = pgTable('maintenance_tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  applianceId: uuid('appliance_id').references(() => appliances.id, { onDelete: 'cascade' }).notNull(),
  taskName: varchar('task_name', { length: 255 }).notNull(),
  scheduledDate: timestamp('scheduled_date').notNull(),
  frequency: varchar('frequency', { length: 50 }).notNull(), // 'One-time', 'Monthly', 'Yearly', 'Custom'
  serviceProvider: json('service_provider'), // { name, phone, email, notes }
  notes: text('notes'),
  status: varchar('status', { length: 50 }).notNull(), // 'Upcoming', 'Completed', 'Overdue'
  completedDate: timestamp('completed_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});