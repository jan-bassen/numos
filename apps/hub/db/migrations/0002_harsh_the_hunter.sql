CREATE TYPE "public"."chain" AS ENUM('ethereum', 'matic', 'klaytn', 'base', 'blast', 'arbitrum', 'arbitrum_nova', 'avalanche', 'optimism', 'solana', 'zora', 'sei', 'b3', 'bera_chain', 'ape_chain', 'flow', 'sepolia', 'amoy', 'baobab', 'base_sepolia', 'blast_sepolia', 'arbitrum_sepolia', 'avalanche_fuji', 'optimism_sepolia', 'soldev', 'zora_sepolia', 'sei_testnet', 'b3_sepolia', 'flow_testnet');--> statement-breakpoint
CREATE TYPE "public"."address_type" AS ENUM('evm', 'sol', 'sei', 'btc');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"username" text,
	"display_username" text,
	"is_anonymous" boolean,
	"role" text,
	"banned" boolean,
	"ban_reason" text,
	"ban_expires" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "collections" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "collections_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"chain" "chain" NOT NULL,
	"address" text NOT NULL,
	"name" text,
	"symbol" text,
	"slug" text,
	"external_url" text,
	"banner_image_url" text,
	"total_supply" integer,
	"spam" jsonb,
	CONSTRAINT "collections_slug_unique" UNIQUE("slug"),
	CONSTRAINT "unique_address_on_chain" UNIQUE("address","chain")
);
--> statement-breakpoint
CREATE TABLE "nfts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "nfts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"owner" integer NOT NULL,
	"collection" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"token_id" integer NOT NULL,
	"name" text,
	"description" text,
	"token_uri" text NOT NULL,
	"image" jsonb,
	"alchemy_updated_at" timestamp NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "wallets" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "wallets_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"address" text NOT NULL,
	"human_readable" text,
	"short_address" text NOT NULL,
	"address_type" "address_type" NOT NULL,
	"user_id" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nfts" ADD CONSTRAINT "nfts_owner_wallets_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."wallets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nfts" ADD CONSTRAINT "nfts_collection_collections_id_fk" FOREIGN KEY ("collection") REFERENCES "public"."collections"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "collection_address_idx" ON "collections" USING btree ("address");--> statement-breakpoint
CREATE UNIQUE INDEX "slug_idx" ON "collections" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "wallet_address_idx" ON "wallets" USING btree ("address");--> statement-breakpoint
CREATE INDEX "wallet_user_id_idx" ON "wallets" USING btree ("user_id");