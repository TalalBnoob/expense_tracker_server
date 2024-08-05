import Express, { NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import createHttpError, { HttpError } from 'http-errors'
import { authRoute } from './routes/auth'
import { expenseRoute } from './routes/expense'
import auth from './middleware/auth'
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
