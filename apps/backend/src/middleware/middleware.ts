import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        wallet: string;
      };
    }
  }
}

const secret = process.env.JWT_SECRET as string;
if (!secret) {
  throw new Error("JWT_SECRET environment variable is required");
}
export  function signinToken(wallet: string) {
  return jwt.sign({ wallet }, secret, { expiresIn: '7d' });
}
export const middleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization invalid",
      });
    }
    const token = authHeader.slice(7);
     const decode=jwt.verify(token , secret, ) as{wallet: string};
       req.user = { wallet: decode.wallet }
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

