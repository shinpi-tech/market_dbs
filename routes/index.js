import Router from 'express'
import stocks from './stocks.js'
import cart from './cart.js'
import order from './order.js'

const router = new Router()

router.use('/market/fbs/stocks', stocks)
router.use('/market/fbs/cart', cart)
router.use('/market/fbs/order', order)

export default router
