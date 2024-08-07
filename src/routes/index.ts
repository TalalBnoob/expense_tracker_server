import Express, { NextFunction, Request, Response } from 'express'
import auth from '../middleware/auth'
import { authRoute } from './auth'
import { expenseRoute } from './expense'
import createHttpError, { HttpError } from 'http-errors'

const router = Express.Router()

router.get('/', auth, (req, res) => {
	res.send(req.body.decoded)
})

router.use('/auth', authRoute)
router.use('/expense', expenseRoute)

// Error Handler
router.use(async (req, res, next) => {
	// next(createHttpError.NotFound())
})

router.use(
	(err: HttpError, req: Request, res: Response, next: NextFunction) => {
		res.status(err.status || 500)
		res.send({
			error: {
				status: err.status || 500,
				massage: err.message,
			},
		})
	},
)

export default router
