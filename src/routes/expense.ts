import Express from 'express'
import expenseController from '../controllers/expense.controller'
import auth from '../middleware/auth'

const router = Express.Router()

router.post('/create', auth, expenseController.create)

export { router as expenseRoute }
