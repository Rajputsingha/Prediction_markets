import express from "express";
import { Router } from "express";
import { getNonce,verifyWallet } from "../controllers/authController";
export const authRouter=Router();

authRouter.get("/nonce",getNonce);
authRouter.post("/verify",verifyWallet);