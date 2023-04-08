import ApiError from '../service/error/ApiError.js'
import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

class OrdersController {
	async post (req, res, next) {
		try {
			
		} catch (e) {
			next(ApiError.badRequest(e))
		}
	}

}

export default new OrdersController()
