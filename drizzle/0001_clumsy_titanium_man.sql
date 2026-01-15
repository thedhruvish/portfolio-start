CREATE TABLE "contact" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone_number" text NOT NULL,
	"message" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "tech" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "tech" SET DEFAULT '{}'::text[];--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "tech" SET NOT NULL;