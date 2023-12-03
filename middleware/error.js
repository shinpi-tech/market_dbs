import ApiError from '../service/error/ApiError.js'

export default function (err, req, res, next) {
	if (err instanceof ApiError) return res.status(err.status).json({ error: err.message })
	res.status(500).json({ error: `Непредвиденная ошибка. (${err.message})` })
	api.post('https://api.shinpi.ru/notification/telegram/', {
		id: [263739791, 340142332],
		message: `Возникла ошибка в сервисе  Яндекс Маркет DBS: ${err.message}`
	})
}
