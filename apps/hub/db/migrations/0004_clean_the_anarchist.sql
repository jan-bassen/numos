CREATE TYPE "public"."sync_status" AS ENUM('syncing', 'success', 'failed');--> statement-breakpoint
CREATE TABLE "syncs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "syncs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"ended_at" timestamp,
	"status" "sync_status" DEFAULT 'syncing' NOT NULL,
	"state" jsonb
);
--> statement-breakpoint
ALTER TABLE "wallets" ADD COLUMN "last_sync" timestamp;--> statement-breakpoint
ALTER TABLE "syncs" ADD CONSTRAINT "syncs_user_users_id_fk" FOREIGN KEY ("user") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;