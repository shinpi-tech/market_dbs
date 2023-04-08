import Router from 'express'
import stocks from './stocks.js'
import cart from './cart.js'
import order from './order.js'
// import orders from './orders.js'

const router = new Router()

router.use('/market/dbs/stocks', stocks)
router.use('/market/dbs/cart', cart)
router.use('/market/dbs/order', order)
// router.use('/market/orders', orders)

export default router
