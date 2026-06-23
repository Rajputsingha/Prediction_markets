import { Router } from 'express'
import { getMarkets, getMarket } from '../controllers/marketController'

 export const marketRouter = Router()

marketRouter.get('/markets', getMarkets)
marketRouter.get('/markets/:id', getMarket)

