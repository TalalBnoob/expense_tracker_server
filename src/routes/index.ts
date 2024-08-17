import Express from 'express'
import AuthController from '../controllers/auth.controller'
import transactionsController from '../controllers/transactions.controller'
import auth from '../middleware/auth'

const router = Express.Router()

router.get('/', (req, res) => {
	res.send('Hello World!')
})

// Auth Routes
router.post('/auth/register', AuthController.create)
router.post('/auth/login', AuthController.login)
router.post('/auth/refresh', AuthController.refresh)
router.delete('/auth', auth, AuthController.destroy)

// Transaction Routes
router.get('/transaction', auth, transactionsController.index)
router.get('/transaction/:id', auth, transactionsController.show)
router.patch('/transaction/edit/:id', auth, transactionsController.update)
router.post('/transaction/create', auth, transactionsController.store)
router.delete('/transaction/:id', auth, transactionsController.destroy)

export default router
