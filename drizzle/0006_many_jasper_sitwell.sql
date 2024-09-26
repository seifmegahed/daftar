ALTER TABLE "project" RENAME COLUMN "client" TO "client_id";--> statement-breakpoint
ALTER TABLE "project" RENAME COLUMN "owner" TO "owner_id";--> statement-breakpoint
ALTER TABLE "project" DROP CONSTRAINT "project_client_client_id_fk";
--> statement-breakpoint
ALTER TABLE "project" DROP CONSTRAINT "project_owner_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
