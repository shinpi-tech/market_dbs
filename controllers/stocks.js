import ApiError from '../service/error/ApiError.js'
import axios from 'axios'

class StocksController {
	async post (req, res, next) {
		try {
			if (process.env.AUTH_TOKEN !== req.headers.authorization) return next(ApiError.forbidden('Токен авторизации не верный.'))
			const { warehouseId, partnerWarehouseId, skus } = req.body
			const skus_res = []
			const date = new Date()
			await axios.get('https://api.shinpi.ru/catalog/products/some', { data: { ids: skus } }).then(async res => {
				for (const el of skus) {
					const pr = await res.data.find(find => find._id === el)
					if (!pr) {
						skus_res.push({
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
						skus_res.push({
							sku: el,
							warehouseId: warehouseId,
							items: [
								{
									type: 'FIT',
									count: pr.quantity <= 3 ? 0 : pr.quantity,
									updatedAt: date.toISOString()
								}
							]
						})
					}
				}
			})
			return res.json({ skus: skus_res })
		} catch (e) {
			next(ApiError.badRequest(e))
		}
	}

}

export default new StocksController()
