import ApiError from '../service/error/ApiError.js'

export default function (err, req, res, next) {
	if (err instanceof ApiError) return res.status(err.status).json({ error: err.message })
	res.status(500).json({ error: `Непредвиденная ошибка. (${err.message})` })
}
