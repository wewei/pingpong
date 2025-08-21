CREATE TABLE `messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pingpong_id` integer NOT NULL,
	`sender_id` integer NOT NULL,
	`content` text NOT NULL,
	`message_type` text DEFAULT 'text',
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`pingpong_id`) REFERENCES `pingpongs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `metadata` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`pingpong_id` integer NOT NULL,
	`name` text NOT NULL,
	`value` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`pingpong_id`) REFERENCES `pingpongs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `metadata_user_id_pingpong_id_name_unique` ON `metadata` (`user_id`,`pingpong_id`,`name`);--> statement-breakpoint
CREATE TABLE `pingpongs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`requester_id` integer NOT NULL,
	`responder_id` integer NOT NULL,
	`status` text DEFAULT 'ping' NOT NULL,
	`priority` text DEFAULT 'medium',
	`eta` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	`closed_at` text,
	FOREIGN KEY (`requester_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`responder_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `users` ADD `avatar_url` text;