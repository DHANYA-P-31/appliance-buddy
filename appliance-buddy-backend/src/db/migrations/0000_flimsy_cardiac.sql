CREATE TABLE `appliances` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`brand` text NOT NULL,
	`model` text NOT NULL,
	`purchase_date` integer NOT NULL,
	`warranty_duration_months` integer NOT NULL,
	`serial_number` text,
	`purchase_location` text,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `brand_idx` ON `appliances` (`brand`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `appliances` (`name`);--> statement-breakpoint
CREATE TABLE `linked_documents` (
	`id` text PRIMARY KEY NOT NULL,
	`appliance_id` text NOT NULL,
	`title` text NOT NULL,
	`url` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`appliance_id`) REFERENCES `appliances`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `maintenance_tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`appliance_id` text NOT NULL,
	`task_name` text NOT NULL,
	`scheduled_date` integer NOT NULL,
	`frequency` text NOT NULL,
	`service_provider_name` text,
	`service_provider_phone` text,
	`service_provider_email` text,
	`service_provider_notes` text,
	`notes` text,
	`status` text NOT NULL,
	`completed_date` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`appliance_id`) REFERENCES `appliances`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `appliance_idx` ON `maintenance_tasks` (`appliance_id`);--> statement-breakpoint
CREATE INDEX `scheduled_date_idx` ON `maintenance_tasks` (`scheduled_date`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `maintenance_tasks` (`status`);--> statement-breakpoint
CREATE TABLE `support_contacts` (
	`id` text PRIMARY KEY NOT NULL,
	`appliance_id` text NOT NULL,
	`name` text NOT NULL,
	`company` text,
	`phone` text,
	`email` text,
	`website` text,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`appliance_id`) REFERENCES `appliances`(`id`) ON UPDATE no action ON DELETE cascade
);
