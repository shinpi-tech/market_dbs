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
			futureDate.setDate(today.getDate() + 3)
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
					delivery: true,
					count: count,
					sellerInn: "526106573390"
				})

				if (el.count > 1) {
					console.log(`${el.offerName} - ${el.count} шт.	${el.offerId}	${req.body.cart.delivery.region.name}	${new Date()}`)
				}
			}

			return res.json({
				cart: {
					deliveryCurrency: "RUR",
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
