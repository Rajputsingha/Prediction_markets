import express from "express";
import { middleware } from "../middleware/middleware";
import { createOrder } from "../controllers/orderController";
import { Router } from "express";

 export const Orderrouter=Router();

Orderrouter.post("/orders",middleware,createOrder);

