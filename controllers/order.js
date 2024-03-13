import { response } from 'express'
import api from '../service/api/http.js'
import ApiError from '../service/error/ApiError.js'
import dotenv from 'dotenv'
dotenv.config()

class OrderController {
	async post (req, res, next) {
		try {
			if (process.env.AUTH_TOKEN_MAIN !== req.headers.authorization && process.env.AUTH_TOKEN_PFO !== req.headers.authorization)
				throw ApiError.forbidden('Токен авторизации не верный.')
			
			const order_number = String(req.body.order.id)
			const items = req.body.order.items
			const result = { accepted: true, id: order_number }
			const orderProducts = items.map(el => ({
				product: el.shopSku,
				storage: '64c7d6f9e9febe6aa7cf946a',
				quantity: el.count
			}))

			if (req.body.order.fake)
				return res.json({ order: result })
			
			return await api.post('https://api.shinpi.ru/stocks/orders/', orderProducts)
				.then(async response => {
					let notification = `✅ Заказ Яндекс Маркет DBS <code>${order_number}</code> на сумму <code>${req.body.order.totalWithSubsidy}</code> ₽. Отгрузка: ${req.body.order.delivery.shipments[0].shipmentDate}\r\n`

					for (const el of items) {
						if (response.data.ok.includes(el.offerId)) {
							notification = notification + `\r\n - ${el.offerName} - ${el.count} шт.\r\n${el.offerId}`
						} else {
							notification = notification + `\r\n - ${el.offerName} - ${el.count} шт. (заказать не получилось)\r\n${el.offerId}`
						}
					}

					await api.post('https://api.shinpi.ru/notification/telegram/', {
						id: [263739791, 340142332],
						message: notification
					})
					return res.json({ order: result })
				})
				.catch(async error => {
					await api.post('https://api.shinpi.ru/notification/telegram/', {
						id: [263739791, 340142332],
						message: `☢️ Заказ Яндекс Маркет DBS <code>${order_number}</code>. Возникла проблема при заказе товаров со склада. <code>\n\n${error.response?.data?.error}</code>`
					})
					return res.json({ order: result })
				})
		} catch (e) {
			next(e)
		}
	}

	async status (req, res, next) {
		try {
			return res.json('ok')
		} catch (e) {
			next(e)
		}
	}

	async cancellation (req, res, next) {
		try {
			return res.json('ok')
		} catch (e) {
			next(e)
		}
	}
}

export default new OrderController()
