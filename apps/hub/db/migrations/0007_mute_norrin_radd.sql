ALTER TABLE "collections" DROP CONSTRAINT "collections_slug_unique";--> statement-breakpoint
DROP INDEX "slug_idx";--> statement-breakpoint
ALTER TABLE "syncs" DROP COLUMN "state";--> statement-breakpoint
ALTER TABLE "wallets" ADD CONSTRAINT "wallet_address_user_id_unique" UNIQUE("address","user_id");