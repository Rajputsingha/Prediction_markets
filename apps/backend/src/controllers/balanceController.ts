import { db, users } from "@repo/db";
import  type { Request, Response } from "express";
import { eq } from 'drizzle-orm'
export async  function getBalance (req:Request, res:Response){
   const wallet = req.user?.wallet;
   if (!wallet) {
     return res.status(403).json({ message: "unauthorized" });
   }

   const user=await db.query.users.findFirst({
     where: eq(users.walletAddress, wallet)
     })
   if (!user) return res.status(404).json({ message: "User not found" })

      
 return res.json({
    available: Number(user.usdcBalance) - Number(user.lockedBalance),
    locked: Number(user.lockedBalance),
    total: Number(user.usdcBalance),
  })

}

export  async function deposit(req:Request, res:Response){
    const wallet =req.user?.wallet;
    if(!wallet){ return res.status(403).json({message:"Unauthorized"})}

    const {amount, txHash}=req.body;
   if(!amount || !txHash){
        return res.status(400).json({message:"amount nad trasactionhash requires"})
    }
    const user=await db.query.users.findFirst({
     where: eq(users.walletAddress, wallet)
    })
    if (!user) return res.status(404).json({ message: "User not found" });

    const newBalance=Number(user.usdcBalance) + Number(amount);
    await db.update(users).set({usdcBalance:String(newBalance)})
    .where(eq(users.id, user.id))
    return res.json({
        available:newBalance -Number(user.lockedBalance),
        locked:Number(user.lockedBalance),
        total:newBalance
    })
}

export async function withdrwal(req:Request, res:Response){
    const wallet =req.user?.wallet;
    if(!wallet){return res.status(403).json({message:"Unauthorized"})}

    const {amount}=req.body;
    if(!amount){
        return res.status(400).json({message:"amount is required"})
    }
    const user=await db.query.users.findFirst({
        where:eq(users.walletAddress, wallet)
    })
    if(!user) return res.status(404).json({message:"User not found"});
    
      const available = Number(user.usdcBalance) - Number(user.lockedBalance)
  if (available < Number(amount)) {
    return res.status(400).json({ message: "Insufficient available balance" })
  }

    const newBalance=Number(user.usdcBalance) - Number(amount);
await db.update(users)
    .set({ usdcBalance: String(newBalance) })
    .where(eq(users.id, user.id))

  return res.json({
    available: newBalance - Number(user.lockedBalance),
    locked: Number(user.lockedBalance),
    total: newBalance,
  })

}