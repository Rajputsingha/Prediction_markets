import { pgTable,  text, timestamp, uuid, numeric } from "drizzle-orm/pg-core";
import { sideEnum, typeEnum,statusEnum } from "./enum";

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  walletAddress: text('wallet_address').notNull().unique(),
  usdcBalance: numeric('usdc_balance', { precision: 18, scale: 6 }).default('0'),
  createdAt: timestamp('created_at').defaultNow(),
});
export const markets=pgTable("market",{
 id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  resolution: text('resolution').notNull(),
  yesprice:numeric('yes_price', {precision:10, scale:6}).default('0.50'),
  noprice:numeric('no_price', {precision:10, scale:6}).default("0.50"),
  createdAt:timestamp('created_at').defaultNow(),
  expiryAt: timestamp('expiry_at').notNull(),
})


export const positions = pgTable('positions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  marketId: uuid('market_id').references(() => markets.id).notNull(),
  yesShares: numeric('yes_shares', { precision: 18, scale: 6 }).default('0'),
  noShares: numeric('no_shares', { precision: 18, scale: 6 }).default('0'),
  avgBuyPrice: numeric('avg_buy_price', { precision: 10, scale: 6 }).default('0'),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const orders=pgTable('orders',{
     id:uuid('id').defaultRandom().primaryKey(),
     userId:uuid('user_id').references(()=> users.id).notNull(),
     marketId:uuid('maket_id').references(()=> markets.id).notNull(),
     side:sideEnum('side').notNull(),
     type:typeEnum('type').notNull(),
     amount:numeric('amount',{precision:18, scale:6}).notNull(),
    price: numeric('price', { precision: 10, scale: 6 }).notNull(),
     status:statusEnum('status').default("OPEN"),
     createdAt: timestamp('created_at').defaultNow(),



})

export const  tradeHistory=pgTable('trade_history',{
    id:uuid('id').defaultRandom().primaryKey(),
    useId:uuid('user_id').references(()=> users.id).notNull(),
    marketId:uuid('market_id').references(()=> markets.id).notNull(),
    side:sideEnum('side').notNull(),
    type:typeEnum('type').notNull(),
    amount:numeric('amount', {precision:18, scale:6}).notNull(),
    price: numeric('price', { precision: 10, scale: 6 }).notNull(),
    txHash: text('tx_hash'),
    createdAt: timestamp('created_at').defaultNow(),

     
})



