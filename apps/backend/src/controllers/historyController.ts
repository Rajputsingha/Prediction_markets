import type { Request, Response } from 'express'
import { db, users, tradeHistory } from '@repo/db'
import { eq } from 'drizzle-orm'

export async function history(req: Request, res: Response) {
  const wallet = req.user?.wallet
  if (!wallet) return res.status(403).json({ message: "Unauthorized" })

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 20
  const offset = (page - 1) * limit

  const user = await db.query.users.findFirst({
    where: eq(users.walletAddress, wallet)
  })
  if (!user) return res.status(404).json({ message: "User not found" })

  const trades = await db.query.tradeHistory.findMany({
    where: eq(tradeHistory.userId, user.id),
    limit,
    offset,
    orderBy: (tradeHistory, { desc }) => [desc(tradeHistory.createdAt)]
  })

  return res.json({ trades, page, limit })
}