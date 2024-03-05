import api from '../service/api/http.js'
import ApiError from '../service/error/ApiError.js'
import axios from 'axios'

class StocksController {
	async post (req, res, next) {
		try {
			if (process.env.AUTH_TOKEN_MAIN !== req.headers.authorization && process.env.AUTH_TOKEN_PFO !== req.headers.authorization)
				throw ApiError.forbidden('Токен авторизации не верный.')
			
			const { warehouseId, skus } = req.body
			const date = new Date()
			const result = []
			const stocks = (await api.post('https://api.shinpi.ru/stocks/products/?limit=500&storage=64c7d6f9e9febe6aa7cf946a', skus)).data

			for (const el of skus) {
				const pr = await stocks.find(find => find.product === el)
				if (!pr) {
					result.push({
						sku: el,
						warehouseId: warehouseId,
						items: [
							{
								type: 'FIT',
								count: 0,
								updatedAt: date.toISOString()
							}
						]
					})
				} else {
					result.push({
						sku: el,
						warehouseId: 552398,
						items: [
							{
								type: 'FIT',
								count: pr.stocks[0].quantity <= 3 ? 0 : pr.stocks[0].quantity,
								updatedAt: date.toISOString()
							}
						]
					})
				}
			}

			return res.json({ skus: result })
		} catch (e) {
			next(e)
		}
	}

}

export default new StocksController()
