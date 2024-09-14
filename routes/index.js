import Router from 'express'
import stocks from './stocks.js'
import cart from './cart.js'
import order from './order.js'

const router = new Router()

router.use('/market/ipkamzin/stocks', stocks)
router.use('/market/ipkamzin/cart', cart)
router.use('/market/ipkamzin/order', order)

export default router
