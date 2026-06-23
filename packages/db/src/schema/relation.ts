import { relations } from "drizzle-orm";
import { users, tradeHistory, orders, markets,positions ,outComes} from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  positions: many(positions),
  orders: many(orders),
  tradeHistory: many(tradeHistory),
}))

export const marketsRelations=relations(markets,({many})=>({
  positions: many(positions),
  orders: many(orders),
  tradeHistory: many(tradeHistory),
  outComes: many(outComes), 
}))

export const  postionsRelation=relations(positions,({one})=>({
 user: one(users, { fields: [positions.userId], references: [users.id] }),
market: one(markets, { fields: [positions.marketId], references: [markets.id] }),
outcome: one(outComes, { fields: [positions.outcomeId], references: [outComes.id] }),

}))

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  market: one(markets, { fields: [orders.marketId], references: [markets.id] }),
    outcome: one(outComes, { fields: [orders.outcomeId], references: [outComes.id] }),
}))

export const tradeHistoryRelations = relations(tradeHistory, ({ one }) => ({
  user: one(users, { fields: [tradeHistory.userId], references: [users.id] }),
  market: one(markets, { fields: [tradeHistory.marketId], references: [markets.id] }),
 outcome: one(outComes, { fields: [tradeHistory.outcomeId], references: [outComes.id] }),
}))

export const outComesRelations = relations(outComes, ({ one, many }) => ({
  market: one(markets, { fields: [outComes.marketId], references: [markets.id] }),
  orders: many(orders),
  positions: many(positions),
  tradeHistory: many(tradeHistory),
}))

