import Router from 'express'
import OrderController from '../controllers/order.js'
const router = new Router()

router.post('/accept', OrderController.post)
router.post('/status', OrderController.status)

export default router
