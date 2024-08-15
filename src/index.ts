import dotenv from 'dotenv'
import Express, { NextFunction, Request, Response } from 'express'
import { HttpError } from 'http-errors'
import router from './routes'

const PORT = process.env.PORT || 3000
const app = Express()

app.use(Express.json())
app.use(Express.urlencoded({ extended: true }))

dotenv.config()

// Router
app.use(router)

// Error Handler
router.use((req, res, next) => {
	// next(createHttpError(404))
})

router.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
	res.status(err.status || 500)
	res.send({
		error: {
			status: err.status || 500,
			message: err.message,
		},
	})
})

app.listen(PORT, () => {
	// eslint-disable-next-line no-console
	console.log(`server ruining on http://localhost:${PORT}`)
})
