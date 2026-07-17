CREATE TABLE `idea_review_actions` (
	`idea_id` text PRIMARY KEY NOT NULL,
	`decision` text DEFAULT 'pending' NOT NULL,
	`important` integer DEFAULT false NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idea_review_decision_idx` ON `idea_review_actions` (`decision`);--> statement-breakpoint
CREATE INDEX `idea_review_important_idx` ON `idea_review_actions` (`important`);