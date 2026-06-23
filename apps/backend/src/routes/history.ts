import { Router } from "express";
import { middleware } from "../middleware/middleware";
import { history } from "../controllers/historyController";
export const historyRouter=Router();

historyRouter.get("/history/trades", middleware, history);