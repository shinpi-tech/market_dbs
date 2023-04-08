import Router from 'express'
import StocksController from '../controllers/stocks.js'
const router = new Router()

router.post('/', StocksController.post)

export default router
