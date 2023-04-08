import Router from 'express'
import stocks from './stocks.js'
import cart from './cart.js'
import order from './order.js'
// import orders from './orders.js'

const router = new Router()

router.use('/market/fbs/stocks', stocks)
router.use('/market/fbs/cart', cart)
router.use('/market/fbs/order', order)
// router.use('/market/orders', orders)

export default router
