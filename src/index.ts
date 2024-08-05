import Express, { NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import createHttpError, { HttpError } from 'http-errors'

import { authRoute } from './routes/auth'
import { expenseRoute } from './routes/expense'
import auth from './middleware/auth'

const PORT = process.env.PORT || 3000
const app = Express()

app.use(Express.json())
app.use(Express.urlencoded({ extended: true }))

dotenv.config()

app.get('/', auth, (req, res) => {
	res.send(req.body.decoded)
})

app.use('/auth', authRoute)
app.use('/expense', expenseRoute)

// Error Handler
app.use(async (req, res, next) => {
	next(createHttpError.NotFound())
})

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
	res.status(err.status || 500)
	res.send({
		error: {
			status: err.status || 500,
			massage: err.message,
		},
	})
})

app.listen(PORT, () => {
	// eslint-disable-next-line no-console
	console.log(`server ruining on http://localhost:${PORT}`)
})
