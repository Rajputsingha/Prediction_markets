import { pgEnum } from "drizzle-orm/pg-core";
export const typeEnum=pgEnum('type',['BUY', "SELL"]);
export const statusEnum = pgEnum('status', ['OPEN', 'FILLED', 'CANCELLED']);
export const marketStatusEnum = pgEnum('market_status', ['OPEN', 'CLOSED', 'RESOLVED'])