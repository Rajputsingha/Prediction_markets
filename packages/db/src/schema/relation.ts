import { relations } from "drizzle-orm";
import { users, tradeHistory, orders, markets,positions } from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  positions: many(positions),
  orders: many(orders),
  tradeHistory: many(tradeHistory),
}))

export const marketsRelations=relations(markets,({many})=>({
  positions: many(positions),
  orders: many(orders),
  tradeHistory: many(tradeHistory),
}))

export const  postionsRelation=relations(positions,({one})=>({
 user: one(users, { fields: [positions.userId], references: [users.id] }),
market: one(markets, { fields: [positions.marketId], references: [markets.id] }),

}))

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  market: one(markets, { fields: [orders.marketId], references: [markets.id] }),
}))

export const tradeHistoryRelations = relations(tradeHistory, ({ one }) => ({
  user: one(users, { fields: [tradeHistory.userId], references: [users.id] }),
  market: one(markets, { fields: [tradeHistory.marketId], references: [markets.id] }),
}))


