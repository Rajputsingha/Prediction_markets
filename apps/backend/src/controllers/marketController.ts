import type { Request, Response } from 'express'
import { db, markets } from '@repo/db'
import { eq } from 'drizzle-orm'

export async function getMarkets(req: Request, res: Response) {
  const allMarkets = await db.query.markets.findMany({
    with: { outComes: true }
  })
  return res.json({ markets: allMarkets })
}

export async function getMarket(req: Request, res: Response) {
  const id = req.params.id as string
  if (!id) return res.status(400).json({ message: "Invalid market id" })

  const market = await db.query.markets.findFirst({
    where: eq(markets.id, id),
    with: { outComes: true }
  })

  if (!market) return res.status(404).json({ message: "Market not found" })

  return res.json({ market })
}
