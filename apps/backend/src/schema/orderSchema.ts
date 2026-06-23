import z from "zod";

export const CreateOrderSchema = z.object({
  marketId: z.string().uuid(),
  outcomeId: z.string().uuid(),
  type: z.enum(['BUY', 'SELL']),
  qty: z.number().positive(),
  price: z.number().min(0).max(1),
})