CREATE TABLE IF NOT EXISTS "project_comment" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" serial NOT NULL,
	"text" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" integer NOT NULL
);
