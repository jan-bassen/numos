DROP INDEX "collection_address_idx";--> statement-breakpoint
CREATE INDEX "collection_address_idx" ON "collections" USING btree ("address");