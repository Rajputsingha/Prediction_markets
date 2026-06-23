import type { Request, Response } from 'express'
import { db, markets, users, positions, tradeHistory, orders } from '@repo/db'
import { randomUUID } from 'crypto'
import { eq, SQL,and } from 'drizzle-orm'
import { CreateOrderSchema } from '../schema/orderSchema'

export const createOrder = async (req: Request, res: Response) => {
  const wallet = req.user?.wallet
  if (!wallet) return res.status(403).json({ message: "Unauthorized" })

  const parsed = CreateOrderSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input", errors: parsed.error.issues })
  }

  const { qty, marketId, outcomeId, type, price } = parsed.data

  const user = await db.query.users.findFirst({
    where: eq(users.walletAddress, wallet)
  })
  if (!user) return res.status(404).json({ message: "User not found" })

  const cost = Number(qty) * Number(price)
  if (Number(user.usdcBalance) < cost) {
    return res.status(400).json({ message: "Insufficient balance" })
  }

  try {
    const result = await db.transaction(async (tx) => {
      const [market] = await tx
        .select()
        .from(markets)
        .where(eq(markets.id, marketId))
        .for('update')

      if (!market) throw new Error("Market not found")

      //  call the Rust matching engine goes here next
      const orderId = randomUUID();
   const engineRes = await fetch('http://127.0.0.1:8081/match', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: orderId,
    user_id: user.id,
    market_id: marketId,
    outcome_id: outcomeId,
    order_type: type === 'BUY' ? 'Buy' : 'Sell',
    qty: String(qty),
    filled_qty: "0",
    price: String(price),
    timestamp: Date.now(),
  })
})
      if(!engineRes.ok) throw new Error("Matching Engine Error");
           const trades = await engineRes.json() as { maker_order_id: string; taker_order_id: string; price: string; qty: string; timestamp: number }[]
             // save order book
             const  totalFilled= trades.reduce((sum, t) => sum + Number(t.qty), 0)
             const status=totalFilled >= Number(qty) ? 'FILLED': totalFilled > 0 ? 'PARTIAL' :'OPEN';
              const orderInsertData = {
        userId: user.id,
        marketId,
        outcomeId,
        type,
        amount: String(qty),
        filledAmount: String(totalFilled),
        price: String(price),
        status,
      } as any
      const [order] = await tx.insert(orders).values(orderInsertData).returning()
            // deduct balance only filled portion 
            const filledCost=totalFilled * Number(price);
            await tx.update(users).set({usdcBalance:String(Number(user.usdcBalance)-filledCost)})
            .where(eq(users.id, user.id));
            // update position  if anything was filled
            if(totalFilled > 0){
              const existingPosition=await tx.query.positions.findFirst({
                where: and(eq(positions.userId, user.id), eq(positions.outcomeId, outcomeId))
              })
              if(existingPosition){
                const newShares= Number (existingPosition.shares)+ totalFilled;
                 await tx.update(positions)
            .set({ shares: String(newShares), updatedAt: new Date() })
            .where(eq(positions.id, existingPosition.id))
        } else {
           await tx.insert(positions).values({
            userId: user.id,
            marketId,
            outcomeId,
            shares: String(totalFilled),
            avgBuyPrice: String(price),
          })
              }
                 // log trade history
        await tx.insert(tradeHistory).values({
          userId: user.id,
          marketId,
          outcomeId,
          type,
          amount: String(totalFilled),
          price: String(price),
        })
            }
             return { order, trades }
    })
    return res.json({ success: true, result })
 
} catch (err: any) {
    return res.status(400).json({ message: err.message })
  }
}


