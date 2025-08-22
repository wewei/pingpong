PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pingpong_id` integer NOT NULL,
	`sender_id` integer NOT NULL,
	`content` text NOT NULL,
	`message_type` text DEFAULT 'text',
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`pingpong_id`) REFERENCES `pingpongs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_messages`("id", "pingpong_id", "sender_id", "content", "message_type", "created_at") SELECT "id", "pingpong_id", "sender_id", "content", "message_type", "created_at" FROM `messages`;--> statement-breakpoint
DROP TABLE `messages`;--> statement-breakpoint
ALTER TABLE `__new_messages` RENAME TO `messages`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_metadata` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`pingpong_id` integer NOT NULL,
	`name` text NOT NULL,
	`value` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`pingpong_id`) REFERENCES `pingpongs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_metadata`("id", "user_id", "pingpong_id", "name", "value", "created_at", "updated_at") SELECT "id", "user_id", "pingpong_id", "name", "value", "created_at", "updated_at" FROM `metadata`;--> statement-breakpoint
DROP TABLE `metadata`;--> statement-breakpoint
ALTER TABLE `__new_metadata` RENAME TO `metadata`;--> statement-breakpoint
CREATE UNIQUE INDEX `metadata_user_id_pingpong_id_name_unique` ON `metadata` (`user_id`,`pingpong_id`,`name`);--> statement-breakpoint
CREATE TABLE `__new_pingpongs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`requester_id` integer NOT NULL,
	`responder_id` integer NOT NULL,
	`status` text DEFAULT 'ping' NOT NULL,
	`eta` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`closed_at` integer,
	FOREIGN KEY (`requester_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`responder_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_pingpongs`("id", "title", "description", "requester_id", "responder_id", "status", "eta", "created_at", "updated_at", "closed_at") SELECT "id", "title", "description", "requester_id", "responder_id", "status", "eta", "created_at", "updated_at", "closed_at" FROM `pingpongs`;--> statement-breakpoint
DROP TABLE `pingpongs`;--> statement-breakpoint
ALTER TABLE `__new_pingpongs` RENAME TO `pingpongs`;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`avatar_url` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "username", "email", "password", "avatar_url", "created_at", "updated_at") SELECT "id", "username", "email", "password", "avatar_url", "created_at", "updated_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);