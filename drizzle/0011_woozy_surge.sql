ALTER TABLE "client" ALTER COLUMN "website" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "item" ALTER COLUMN "mpn" SET DATA TYPE varchar(128);--> statement-breakpoint
ALTER TABLE "document" ADD CONSTRAINT "document_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "supplier" ADD CONSTRAINT "supplier_name_unique" UNIQUE("name");