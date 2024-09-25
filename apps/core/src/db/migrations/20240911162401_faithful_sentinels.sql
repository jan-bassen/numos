DO $$ BEGIN
 CREATE TYPE "public"."attributeType" AS ENUM('string', 'number', 'boolean', 'enum', 'datetime', 'location', 'address', 'color');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."scheduleType" AS ENUM('interval', 'cron');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."tokenEventType" AS ENUM('mint', 'transfer', 'approval', 'burn');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "actions" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"deployment" serial NOT NULL,
	"graph" jsonb NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "api_triggers" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"action" serial NOT NULL,
	"parameters" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "attributes" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"deployment" serial NOT NULL,
	"type" "attributeType" NOT NULL,
	"description" text,
	"settings" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "collections" (
	"id" serial PRIMARY KEY NOT NULL,
	"studio_id" uuid NOT NULL,
	"slug" varchar NOT NULL,
	"deployed_at" timestamp DEFAULT now(),
	"chain_id" integer NOT NULL,
	"address" varchar NOT NULL,
	CONSTRAINT "collections_studio_id_unique" UNIQUE("studio_id"),
	CONSTRAINT "collections_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deployments" (
	"id" serial PRIMARY KEY NOT NULL,
	"collection" serial NOT NULL,
	"major" integer NOT NULL,
	"minor" integer NOT NULL,
	"patch" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"image_graph" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "time_triggers" (
	"id" serial PRIMARY KEY NOT NULL,
	"aws_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"action" serial NOT NULL,
	"type" "scheduleType" NOT NULL,
	"schedule" varchar NOT NULL,
	"start_at" timestamp,
	"end_at" timestamp,
	CONSTRAINT "time_triggers_aws_id_unique" UNIQUE("aws_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "token_triggers" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"action" serial NOT NULL,
	"event_type" "tokenEventType" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"collection" serial NOT NULL,
	"token_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"attributes" jsonb NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "actions" ADD CONSTRAINT "actions_deployment_deployments_id_fk" FOREIGN KEY ("deployment") REFERENCES "public"."deployments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "api_triggers" ADD CONSTRAINT "api_triggers_action_actions_id_fk" FOREIGN KEY ("action") REFERENCES "public"."actions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "attributes" ADD CONSTRAINT "attributes_deployment_deployments_id_fk" FOREIGN KEY ("deployment") REFERENCES "public"."deployments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deployments" ADD CONSTRAINT "deployments_collection_collections_id_fk" FOREIGN KEY ("collection") REFERENCES "public"."collections"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "time_triggers" ADD CONSTRAINT "time_triggers_action_actions_id_fk" FOREIGN KEY ("action") REFERENCES "public"."actions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "token_triggers" ADD CONSTRAINT "token_triggers_action_actions_id_fk" FOREIGN KEY ("action") REFERENCES "public"."actions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tokens" ADD CONSTRAINT "tokens_collection_collections_id_fk" FOREIGN KEY ("collection") REFERENCES "public"."collections"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "action_key_idx" ON "actions" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "action_deployment_idx" ON "actions" USING btree ("deployment");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "api_trigger_key_idx" ON "api_triggers" USING btree ("key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "api_trigger_action_idx" ON "api_triggers" USING btree ("action");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "attribute_key_idx" ON "attributes" USING btree ("key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "attribute_deployment_idx" ON "attributes" USING btree ("deployment");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "studio_id_idx" ON "collections" USING btree ("studio_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "collection_key_idx" ON "collections" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "address_idx" ON "collections" USING btree ("address");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "deployment_collection_idx" ON "deployments" USING btree ("collection");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "aws_schedule_id_idx" ON "time_triggers" USING btree ("aws_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "time_trigger_action_idx" ON "time_triggers" USING btree ("action");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "token_trigger_action_idx" ON "token_triggers" USING btree ("action");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "token_collection_idx" ON "tokens" USING btree ("collection");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "token_id_idx" ON "tokens" USING btree ("token_id");