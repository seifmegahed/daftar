ALTER TABLE "project_items" RENAME TO "purchase_item";--> statement-breakpoint
ALTER TABLE "commercial_offer_item" RENAME TO "sale_item";--> statement-breakpoint
ALTER TABLE "sale_item" DROP CONSTRAINT "commercial_offer_item_project_id_project_id_fk";
--> statement-breakpoint
ALTER TABLE "sale_item" DROP CONSTRAINT "commercial_offer_item_item_id_item_id_fk";
--> statement-breakpoint
ALTER TABLE "purchase_item" DROP CONSTRAINT "project_items_project_id_project_id_fk";
--> statement-breakpoint
ALTER TABLE "purchase_item" DROP CONSTRAINT "project_items_item_id_item_id_fk";
--> statement-breakpoint
ALTER TABLE "purchase_item" DROP CONSTRAINT "project_items_supplier_id_supplier_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sale_item" ADD CONSTRAINT "sale_item_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sale_item" ADD CONSTRAINT "sale_item_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "purchase_item" ADD CONSTRAINT "purchase_item_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "purchase_item" ADD CONSTRAINT "purchase_item_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "purchase_item" ADD CONSTRAINT "purchase_item_supplier_id_supplier_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."supplier"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
