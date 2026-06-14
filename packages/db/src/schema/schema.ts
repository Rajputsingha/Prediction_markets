import { pgTable,  text, timestamp, uuid, numeric, index } from "drizzle-orm/pg-core";
import { sideEnum, typeEnum,statusEnum,marketStatusEnum,outcomeEnum } from "./enum";

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
  status: marketStatusEnum('status').default('OPEN'),
  outcome: outcomeEnum('outcome'),
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
},(table)=>({
  userIdIdx:index('positions_user_id_idx').on(table.userId),
  marketIdIdx: index('positions_market_id_idx').on(table.marketId),
}))

export const orders=pgTable('orders',{
     id:uuid('id').defaultRandom().primaryKey(),
     userId:uuid('user_id').references(()=> users.id).notNull(),
     marketId:uuid('market_id').references(()=> markets.id).notNull(),
     side:sideEnum('side').notNull(),
     type:typeEnum('type').notNull(),
     amount:numeric('amount',{precision:18, scale:6}).notNull(),
    price: numeric('price', { precision: 10, scale: 6 }).notNull(),
     status:statusEnum('status').default("OPEN"),
     createdAt: timestamp('created_at').defaultNow(),
}, (table)=>({
   userIdIdx:index('orders_user_id_idx').on(table.userId),
   marketIdx:index('order_market_id_idx').on(table.marketId),
   statusIdx:index('orders_status_idx').on(table.status),
}))

export const  tradeHistory=pgTable('trade_history',{
    id:uuid('id').defaultRandom().primaryKey(),
    userId:uuid('user_id').references(()=> users.id).notNull(),
    marketId:uuid('market_id').references(()=> markets.id).notNull(),
    side:sideEnum('side').notNull(),
    type:typeEnum('type').notNull(),
    amount:numeric('amount', {precision:18, scale:6}).notNull(),
    price: numeric('price', { precision: 10, scale: 6 }).notNull(),
    txHash: text('tx_hash'),
    createdAt: timestamp('created_at').defaultNow(),

     
}, (table) => ({
  userIdIdx: index('trade_history_user_id_idx').on(table.userId),
  createdAtIdx: index('trade_history_created_at_idx').on(table.createdAt),
}))




