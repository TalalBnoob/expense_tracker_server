import Express, { NextFunction, Request, Response } from 'express'
import { HttpError } from 'http-errors'
import auth from '../middleware/auth'
import { authRoute } from './auth'
import { transactionsRoute } from './transactions'

const router = Express.Router()

router.get('/', auth, (req, res) => {
	res.send(req.body.decoded)
})

router.use('/auth', authRoute)
router.use('/expense', transactionsRoute)

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

export default router
