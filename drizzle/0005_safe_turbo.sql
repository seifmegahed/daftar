ALTER TABLE "project" ALTER COLUMN "start_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "end_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "item" ADD CONSTRAINT "item_name_unique" UNIQUE("name");