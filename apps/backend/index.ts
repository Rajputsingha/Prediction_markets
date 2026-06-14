import express, { Router } from "express";
import cors from "cors";
import { authRouter } from "./src/routes/auth";
import { db, } from "@repo/db";
const app=express();
app.use(express.json());
app.use(cors());

app.use("/api",authRouter);
app.listen(8080,()=>{
    console.log("Server is listening to the request ");
})