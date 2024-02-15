import api from '../service/api/http.js'
import ApiError from '../service/error/ApiError.js'
import dotenv from 'dotenv'
dotenv.config()

class CartController {
	async post (req, res, next) {
		try {
			if (process.env.AUTH_TOKEN_MAIN !== req.headers.authorization && process.env.AUTH_TOKEN_PFO !== req.headers.authorization)
				throw ApiError.forbidden('Токен авторизации не верный.')
			
			const today = new Date()
			let futureDate = new Date(today)
			futureDate.setDate(today.getDate() + 2)
			const day = futureDate.getDate().toString().padStart(2, '0')
			const month = (futureDate.getMonth() + 1).toString().padStart(2, '0')
			const year = futureDate.getFullYear()
   
			const formattedDate = `${day}-${month}-${year}`
			
			const items = req.body.cart.items
			const ids = [...new Set(items.map(el => el.offerId))]
			const result = []
			const stocks = (await api.post('https://api.shinpi.ru/stocks/products/', ids, {
				params: {
					limit: 500,
					storage: '64c7d6f9e9febe6aa7cf946a'
				}
			})).data

			for (const el of items) {
				const pr = await stocks.find(find => find.product === el.offerId)
				const count = pr ? pr.stocks[0].quantity < 4 ? 0 : pr.stocks[0].quantity : 0

				result.push({
					feedId: el.feedId,
					offerId: el.offerId,
					count: count,
					sellerInn: "526106573390"
				})
			}

			return res.json({
				cart: {
					deliveryCurrency: "RUR",
					// deliveryOptions: [{
					// 	type: "DELIVERY",
					// 	price: 0,
					// 	serviceName: "Своя доставка",
					// 	dates: {
					// 		fromDate: formattedDate,
					// 		toDate: formattedDate,
					// 		intervals: [
					// 			{
					// 				date: formattedDate,
					// 				fromTime: "10:00",
					// 				toTime: "23:00"
					// 			}
					// 		]
					// 	},
					// 	paymentMethods: [
					// 		"YANDEX",
					// 		"APPLE_PAY",
					// 		"GOOGLE_PAY",
					// 		"TINKOFF_CREDIT",
					// 		"TINKOFF_INSTALLMENTS",
					// 		"SBP"
					// 	]
					// }],
					deliveryOptions: [{
						price: 0,
						type: "PICKUP",
						serviceName: "yandex_delivery",
						dates: {
							fromDate: formattedDate,
							toDate: formattedDate
						},
						outlets: [
							{
								code: "yandex_delivery"
							}
						],
						paymentMethods: [
							"YANDEX",
							"APPLE_PAY",
							"GOOGLE_PAY",
							"TINKOFF_CREDIT",
							"TINKOFF_INSTALLMENTS",
							"SBP"
						]
					}],
					items: result,
					paymentMethods: [
						"YANDEX",
						"APPLE_PAY",
						"GOOGLE_PAY",
						"TINKOFF_CREDIT",
						"TINKOFF_INSTALLMENTS",
						"SBP"
					]
				}
			})
		} catch (e) {
			next(e)
		}
	}

}

export default new CartController()
