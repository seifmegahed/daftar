CREATE TABLE IF NOT EXISTS "user_request" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(64) NOT NULL,
	"username" varchar(64) NOT NULL,
	"name" varchar(64) NOT NULL,
	"password" varchar(128) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"status" boolean DEFAULT false NOT NULL
);
