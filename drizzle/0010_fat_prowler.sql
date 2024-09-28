ALTER TABLE "address" ALTER COLUMN "notes" SET DATA TYPE varchar(512);--> statement-breakpoint
ALTER TABLE "client" ALTER COLUMN "notes" SET DATA TYPE varchar(512);--> statement-breakpoint
ALTER TABLE "contact" ALTER COLUMN "notes" SET DATA TYPE varchar(512);--> statement-breakpoint
ALTER TABLE "document" ALTER COLUMN "notes" SET DATA TYPE varchar(512);--> statement-breakpoint
ALTER TABLE "item" ALTER COLUMN "description" SET DATA TYPE varchar(512);--> statement-breakpoint
ALTER TABLE "item" ALTER COLUMN "notes" SET DATA TYPE varchar(512);--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "description" SET DATA TYPE varchar(512);--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "notes" SET DATA TYPE varchar(512);--> statement-breakpoint
ALTER TABLE "supplier" ALTER COLUMN "notes" SET DATA TYPE varchar(512);