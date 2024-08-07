import Express from 'express'
import transactionsController from '../controllers/transactions.controller'
import auth from '../middleware/auth'

const router = Express.Router()

router.post('/create', auth, transactionsController.create)

export { router as transactionsRoute }
