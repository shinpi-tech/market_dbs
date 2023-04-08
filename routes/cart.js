import Router from 'express'
import CartController from '../controllers/cart.js'
const router = new Router()

router.post('/', CartController.post)

export default router