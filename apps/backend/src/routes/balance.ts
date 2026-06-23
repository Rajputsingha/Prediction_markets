import { Router } from "express";
import { getBalance, withdrwal, deposit } from "../controllers/balanceController";
import { middleware } from "../middleware/middleware";

 export const balanceRouter=Router();

balanceRouter.get("/balance", middleware, getBalance);
balanceRouter.post("/balance/deposit", middleware, deposit);
balanceRouter.post("/balance/withdraw", middleware, withdrwal);