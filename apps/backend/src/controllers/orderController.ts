import type { Request, Response } from 'express'
import { db,users } from '@repo/db'
import { eq } from 'drizzle-orm'

export const createOrder = async (req: Request, res: Response) => {
  const wallet = req.user?.wallet

  if (!wallet) {
    return res.status(403).json({ message: "Unauthorized" })
  }
  const {amount, marketId,side, type,price}=req.body;

if(!amount || !marketId || !price || !side ||!type){
    return res.status(400).json({
    message:"missing required fields"
    })
}
const user = await db.query.users.findFirst({
  where: eq(users.walletAddress, wallet)
})
if (!user) {
  return res.status(404).json({ message: "User not found" })
}
const cost=Number(amount) * Number(price)
if(Number(user.usdcBalance) < cost){
    return res.status(400).json({
        message:"insuficiant balance"
    })


}


}