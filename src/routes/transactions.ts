import Express from 'express'
import transactionsController from '../controllers/transactions.controller'
import auth from '../middleware/auth'

const router = Express.Router()

router.get('/', auth, transactionsController.index)
router.get('/:id', auth, transactionsController.show)
router.post('/edit/:id', auth, transactionsController.update)
router.post('/create', auth, transactionsController.store)
router.delete('/:id', auth, transactionsController.destroy)

export { router as transactionsRoute }
