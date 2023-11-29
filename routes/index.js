import Router from 'express'
import stocks from './stocks.js'
import cart from './cart.js'
import order from './order.js'

const router = new Router()

router.use('/market/dbs/stocks', stocks)
router.use('/market/dbs/cart', cart)
router.use('/market/dbs/order', order)

export default router
