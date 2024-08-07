import { NextFunction, Request, Response } from 'express'
import { createAuthValidation } from '../helpers/validation'
import createHttpError from 'http-errors'
import bcrypt from 'bcryptjs'
import { refreshTokenVerify, setUserTokens } from '../helpers/jwt_helper'
import { prisma } from '../config'
import { passwordHash } from '../helpers/hash'

class AuthController {
	static async create(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, password } = createAuthValidation(req.body)

			const doseExist = await prisma.user.findUnique({
				where: {
					email: email,
				},
			})

			if (doseExist)
				throw createHttpError.Conflict(`${email} is already been registered`)

			const newUser = await prisma.user.create({
				data: {
					email: email,
					password: await passwordHash(password),
					amount: 1000,
				},
			})

			const { accessToken, refreshToken } = await setUserTokens(newUser.id)
			res.send({
				access_token: accessToken,
				refresh_token: refreshToken,
				user: newUser,
			})
		} catch (err) {
			next(err)
		}
	}

	static async login(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, password } = createAuthValidation(req.body)

			const userInfo = await prisma.user.findFirstOrThrow({
				where: {
					email: email,
				},
			})

			if (!userInfo) throw createHttpError.NotFound()

			if (!(await bcrypt.compare(password, userInfo.password)))
				throw createHttpError.BadRequest()

			const { accessToken, refreshToken } = await setUserTokens(userInfo.id)
			res.send({ access_token: accessToken, refresh_token: refreshToken })
		} catch (err) {
			next(err)
		}
	}

	static async refresh(req: Request, res: Response, next: NextFunction) {
		try {
			if (!req.body.token)
				throw createHttpError.Unauthorized('No token has been provided')

			const token = req.body.token

			const isValid = await refreshTokenVerify(token)

			const { accessToken, refreshToken } = await setUserTokens(isValid.userId)
			res.send({ access_token: accessToken, refresh_token: refreshToken })
		} catch (err) {
			next(err)
		}
	}
}

export default AuthController
