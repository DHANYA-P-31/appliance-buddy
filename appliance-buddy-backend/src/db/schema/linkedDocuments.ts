import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { appliances } from './appliances';

export const linkedDocuments = pgTable('linked_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  applianceId: uuid('appliance_id').references(() => appliances.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  url: varchar('url', { length: 1000 }).notNull(),
});