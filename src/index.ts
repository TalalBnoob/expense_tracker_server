import dotenv from 'dotenv'
import Express from 'express'
import router from './routes'

const PORT = process.env.PORT || 3000
const app = Express()

app.use(Express.json())
app.use(Express.urlencoded({ extended: true }))

dotenv.config()

// Router
app.use(router)

app.listen(PORT, () => {
	// eslint-disable-next-line no-console
	console.log(`server ruining on http://localhost:${PORT}`)
})
