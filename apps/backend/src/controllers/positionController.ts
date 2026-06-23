import  type{Request, Response} from "express"
import { db, users,positions } from "@repo/db"
import { eq } from 'drizzle-orm'
export async function  getPosition(req:Request, res:Response){
    const wallet=req.user?.wallet;
    if(!wallet){return res.status(403).json({message:"Unauthorized"})};

    const user=await db.query.users.findFirst({
        where:eq(users.walletAddress, wallet)
    })
    if(!user){
        return res.status(400).json({message:" user not found"})
    }

   const userPositions = await db.query.positions.findMany({
    where:eq(positions.userId, user.id)
   })
   return res.json({ positions: userPositions })
}