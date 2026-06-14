CREATE TYPE "public"."market_status" AS ENUM('OPEN', 'CLOSED', 'RESOLVED');--> statement-breakpoint
CREATE TYPE "public"."outcome" AS ENUM('YES', 'NO');--> statement-breakpoint
CREATE TYPE "public"."side" AS ENUM('Yes', 'No');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('OPEN', 'FILLED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."type" AS ENUM('BUY', 'SELL');--> statement-breakpoint
CREATE TABLE "market" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"resolution" text NOT NULL,
	"status" "market_status" DEFAULT 'OPEN',
	"outcome" "outcome",
	"yes_price" numeric(10, 6) DEFAULT '0.50',
	"no_price" numeric(10, 6) DEFAULT '0.50',
	"created_at" timestamp DEFAULT now(),
	"expiry_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"market_id" uuid NOT NULL,
	"side" "side" NOT NULL,
	"type" "type" NOT NULL,
	"amount" numeric(18, 6) NOT NULL,
	"price" numeric(10, 6) NOT NULL,
	"status" "status" DEFAULT 'OPEN',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "positions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"market_id" uuid NOT NULL,
	"yes_shares" numeric(18, 6) DEFAULT '0',
	"no_shares" numeric(18, 6) DEFAULT '0',
	"avg_buy_price" numeric(10, 6) DEFAULT '0',
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trade_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"market_id" uuid NOT NULL,
	"side" "side" NOT NULL,
	"type" "type" NOT NULL,
	"amount" numeric(18, 6) NOT NULL,
	"price" numeric(10, 6) NOT NULL,
	"tx_hash" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_address" text NOT NULL,
	"usdc_balance" numeric(18, 6) DEFAULT '0',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_wallet_address_unique" UNIQUE("wallet_address")
);
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_market_id_market_id_fk" FOREIGN KEY ("market_id") REFERENCES "public"."market"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "positions" ADD CONSTRAINT "positions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "positions" ADD CONSTRAINT "positions_market_id_market_id_fk" FOREIGN KEY ("market_id") REFERENCES "public"."market"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trade_history" ADD CONSTRAINT "trade_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trade_history" ADD CONSTRAINT "trade_history_market_id_market_id_fk" FOREIGN KEY ("market_id") REFERENCES "public"."market"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "orders_user_id_idx" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "order_market_id_idx" ON "orders" USING btree ("market_id");--> statement-breakpoint
CREATE INDEX "orders_status_idx" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "positions_user_id_idx" ON "positions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "positions_market_id_idx" ON "positions" USING btree ("market_id");--> statement-breakpoint
CREATE INDEX "trade_history_user_id_idx" ON "trade_history" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "trade_history_created_at_idx" ON "trade_history" USING btree ("created_at");