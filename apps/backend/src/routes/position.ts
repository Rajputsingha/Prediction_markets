import { Router } from "express";
import { getPosition } from "../controllers/positionController";
import { middleware } from "../middleware/middleware";
 export const postionRouter=Router();

postionRouter.get("/positions",middleware, getPosition)