import ApiError from '../service/error/ApiError.js'
import axios from 'axios'
import TelegramBot from 'node-telegram-bot-api'
import dotenv from 'dotenv'
dotenv.config()

const token = process.env.TOKEN
const bot = new TelegramBot(token, { polling: true })

class OrderController {
	async post (req, res, next) {
		try {
			if (process.env.AUTH_TOKEN !== req.headers.authorization) return next(ApiError.forbidden('Токен авторизации не верный.'))
			const order_number = String(req.body.order.id)
			const items = req.body.order.items
			const order = {
				accepted: true,
				id: order_number
			}
			if (req.body.order.fake) {
				return res.json({ order })
			}
			await items.forEach(el => {
				axios.post('https://api.shinpi.ru/kolobox/orders/', null, {
					params: { id: el.shopSku, quantity: el.count },
					headers: { token: process.env.TOKEN_API }
				}).then(result => {
					axios.get('https://api.shinpi.ru/catalog/products/' + el.shopSku)
						.then(async product => {
							await bot.sendMessage(5413966898, `✅ Новый заказ <code>${order_number}</code> на сумму <code>${product.data.price.rp * el.count}</code> ₽. Отгрузка: ${req.body.order.delivery.shipments[0].shipmentDate}\r\n\r\n • <code>${product.data.name}</code> - ${el.count} шт.\r\n\r\n- Артикул: <code>${product.data.article}</code>\r\n- ID: <code>${el.offerId}</code>\r\n- Заказ: <code>${result.data.orders[0]}</code>\r\n- Оптовая цена: <code>${product.data.price.wp * el.count}</code> ₽`, {parse_mode: 'HTML'}).catch(error => console.log(error))
						})
				}).catch(async error => {
					await bot.sendMessage(5413966898, `🆘 Новый заказ <code>${order_number}</code> на сумму ${req.body.order.itemsTotal} ₽. Отгрузка: ${req.body.order.delivery.shipments[0].shipmentDate}\r\n\r\n • ${el.offerName} - ${el.count} шт.\r\n<code>${el.offerId}</code>\r\n\r\nЗаказ не оформлен!`, { parse_mode: 'HTML' }).catch(error => console.log(error))
				})
			})
			return res.json({ order })
		} catch (e) {
			next(ApiError.badRequest(e))
		}
	}

	async status (req, res, next) {
		try {
			return res.json('ok')
		} catch (e) {
			next(ApiError.badRequest(e))
		}
	}
}

export default new OrderController()
