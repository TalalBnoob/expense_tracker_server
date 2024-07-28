import Express from 'express'
import AuthController from '../controllers/auth.controller'

const router = Express.Router()

router.post('/register', AuthController.create)
router.post('/login', AuthController.login)

export { router as authRoute }
