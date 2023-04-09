import ApiError from '../service/error/ApiError.js'
import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

class CartController {
	async post (req, res, next) {
		try {
			if (process.env.AUTH_TOKEN !== req.headers.authorization) return next(ApiError.forbidden('Токен авторизации не верный.'))
			const products = req.body.cart.items
			const items_result = []
			const cart = {
				deliveryCurrency: "RUR",
				deliveryOptions: [
					{
						id: '1',
						price: 0,
						serviceName: 'SHINPI.RU',
						type: 'DELIVERY',
						dates: {
							fromDate: '10-04-2023',
							toData: '12-04-2023',
							intervals: [
								{
									data: '10-04-2023',
									fromTime: '10:00',
									toTime: '21:00'
								},
								{
									data: '11-04-2023',
									fromTime: '10:00',
									toTime: '21:00'
								},
								{
									data: '12-04-2023',
									fromTime: '10:00',
									toTime: '21:00'
								}
							]
						}
					}
				],
				paymentMethods: ["YANDEX"]
			}
			for (const el of products) {
                let count = 0
				await axios.get('https://api.shinpi.ru/kolobox/products/', {
					params: { id: el.offerId },
					headers: { token: process.env.TOKEN_API }
				})
					.then(result => {
						count = result.data.count_local < 4 ? 0 : result.data.count_local
						items_result.push({
							feedId: el.feedId,
							offerId: el.offerId,
							delivery: true,
							count: result.data.count_local === null ? 0 : count,
							sellerInn: '526106573390'
						})
					})
					.catch(async () => {
						const product = (await axios.get('https://api.shinpi.ru/catalog/products/' + el.offerId)).data
						count = product.quantity < 4 ? 0 : product.quantity
						items_result.push({
							feedId: el.feedId,
							offerId: el.offerId,
							delivery: true,
							count: count,
							sellerInn: '526106573390'
						})
					})
			}
			cart.items = items_result
			return res.json({ cart: cart })
		} catch (e) {
			next(ApiError.badRequest(e))
		}
	}

}

export default new CartController()
