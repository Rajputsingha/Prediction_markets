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

