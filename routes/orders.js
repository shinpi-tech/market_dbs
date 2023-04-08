import Router from 'express'
import OrdersController from '../controllers/orders.js'
const router = new Router()

router.post('/accept', OrdersController.get)
router.post('/status', OrdersController.status)

export default router
