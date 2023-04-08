import ApiError from '../service/error/ApiError.js'

export default function (req, res, next) {
	try {
		const api_token = req.headers.token
		if (!api_token) return next(ApiError.unauthorized('Вы не авторизованы.'))

        if (process.env.API_KEY !== api_token) return next(ApiError.unauthorized('Вы не авторизованы.'))

		next()
	} catch (e) {
		next(ApiError.unauthorized('Вы не авторизованы.'))
	}
}
