import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

const auth = async () => {
	globalThis.token = (await axios.post('https://api.shinpi.ru/auth/access/token', null, {
		headers: { Token: process.env.API_TOKEN },
		params: { token_id: process.env.API_TOKEN_ID }
	})).data.access_token
}

const api = axios.create()

api.interceptors.request.use(
	async config => {
		if (!globalThis.token) {
			await auth()
			config.headers['Authorization'] = `Bearer ${globalThis.token}`
		} else {
			config.headers['Authorization'] = `Bearer ${globalThis.token}`
		}
		return config
	},
	error => Promise.reject(error)
)

api.interceptors.response.use(
	function (response) {
		return response
	},
	async function (error) {
		const originalRequest = error.config
		if (error.response && error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true; // Помечаем запрос, чтобы избежать бесконечного цикла
			try {
				await auth() // Запрашиваем новый access токен
				api.defaults.headers.common['Authorization'] = `Bearer ${globalThis.token}`
				originalRequest.headers['Authorization'] = `Bearer ${globalThis.token}`
				return api(originalRequest)
			} catch (refreshError) {
				return Promise.reject(refreshError)
			}
		}
		return Promise.reject(error)
	}
)

export default api