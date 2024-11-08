ALTER TABLE "user" ADD COLUMN "wrong_attempts" smallint DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "locked_until" timestamp;