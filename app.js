import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import router from './routes/index.js'
import error from './middleware/error.js'
import axios from 'axios'
// import morgan from 'morgan'
dotenv.config()

const PORT = process.env.PORT
const app = express()

app.use(express.json())
// app.use(cors({
// 	origin: process.env.CLIENT_URL,
// 	credentials: true
// }))
// app.use(morgan('common'))
app.use(router)
app.use(error)

const start = async () => {
	try {
		globalThis.public_key = (await axios.get('https://api.shinpi.ru/auth/public-key')).data
		app.listen(PORT, () => console.log(`✅ Сервер запущен на порту ${PORT}`))
	} catch (e) {
		console.log(e)
	}
}

start()