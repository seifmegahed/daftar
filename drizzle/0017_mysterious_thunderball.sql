CREATE TABLE IF NOT EXISTS "commercial_offer_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"item_id" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"currency" integer NOT NULL,
	"quantity" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "commercial_offer_item" ADD CONSTRAINT "commercial_offer_item_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "commercial_offer_item" ADD CONSTRAINT "commercial_offer_item_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
