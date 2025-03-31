CREATE INDEX "nft_token_id_idx" ON "nfts" USING btree ("token_id");--> statement-breakpoint
CREATE INDEX "nft_owner_idx" ON "nfts" USING btree ("owner");--> statement-breakpoint
CREATE INDEX "nft_collection_idx" ON "nfts" USING btree ("collection");--> statement-breakpoint
ALTER TABLE "nfts" ADD CONSTRAINT "nft_token_id_owner_idx" UNIQUE("token_id","owner","collection");