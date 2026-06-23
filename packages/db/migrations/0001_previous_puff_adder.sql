CREATE TABLE "outcomes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"market_id" uuid NOT NULL,
	"label" text NOT NULL,
	"price" numeric(10, 6) DEFAULT '0.50',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "outcome_id" uuid ;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "filled_amount" numeric(18, 6) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "positions" ADD COLUMN "outcome_id" uuid;--> statement-breakpoint
ALTER TABLE "positions" ADD COLUMN "shares" numeric(18, 6) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "trade_history" ADD COLUMN "outcome_id" uuid;--> statement-breakpoint
ALTER TABLE "outcomes" ADD CONSTRAINT "outcomes_market_id_market_id_fk" FOREIGN KEY ("market_id") REFERENCES "public"."market"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "outcomes_market_id_idx" ON "outcomes" USING btree ("market_id");--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_outcome_id_outcomes_id_fk" FOREIGN KEY ("outcome_id") REFERENCES "public"."outcomes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "positions" ADD CONSTRAINT "positions_outcome_id_outcomes_id_fk" FOREIGN KEY ("outcome_id") REFERENCES "public"."outcomes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trade_history" ADD CONSTRAINT "trade_history_outcome_id_outcomes_id_fk" FOREIGN KEY ("outcome_id") REFERENCES "public"."outcomes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "market" DROP COLUMN "outcome";--> statement-breakpoint
ALTER TABLE "market" DROP COLUMN "yes_price";--> statement-breakpoint
ALTER TABLE "market" DROP COLUMN "no_price";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "side";--> statement-breakpoint
ALTER TABLE "positions" DROP COLUMN "yes_shares";--> statement-breakpoint
ALTER TABLE "positions" DROP COLUMN "no_shares";--> statement-breakpoint
ALTER TABLE "trade_history" DROP COLUMN "side";--> statement-breakpoint
DROP TYPE "public"."outcome";--> statement-breakpoint
DROP TYPE "public"."side";