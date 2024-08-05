import { NextFunction, Request, Response } from 'express'
import { userSchema } from '../helpers/validation'
import createHttpError from 'http-errors'
import bcrypt from 'bcryptjs'
import { refreshTokenVerify, setUserTokens } from '../helpers/jwt_helper'
import { prisma } from '../config'
import { passwordHash } from '../helpers/hash'

const AuthController = {
	create: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const result = userSchema.parse(req.body)

			const doseExist = await prisma.user.findUnique({
				where: {
					email: result.email,
				},
			})

			if (doseExist) throw createHttpError.Conflict(`${result.email} is already been registered`)
			const newUser = await prisma.user.create({
				data: {
					email: result.email,
					password: await passwordHash(result.password),
					amount: 0,
				},
			})

			const { accessToken, refreshToken } = await setUserTokens(newUser.id)
			res.send({ access_token: accessToken, refresh_token: refreshToken, user: newUser })
		} catch (err) {
			next(err)
		}
	},
	login: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const result = userSchema.parse(req.body)

			const userInfo = await prisma.user.findFirstOrThrow({
				where: {
					email: result.email,
				},
			})

			if (!userInfo) throw createHttpError.NotFound()

			if (!(await bcrypt.compare(result.password, userInfo.password))) throw createHttpError.BadRequest()

			const { accessToken, refreshToken } = await setUserTokens(userInfo.id)
			res.send({ access_token: accessToken, refresh_token: refreshToken })
		} catch (err) {
			next(err)
		}
	},
	refresh: async (req: Request, res: Response, next: NextFunction) => {
		try {
			if (!req.body.token) throw createHttpError.Unauthorized('No token has been provided')

			const token = req.body.token

			const isValid = await refreshTokenVerify(token)

			const { accessToken, refreshToken } = await setUserTokens(isValid.userId)
			res.send({ access_token: accessToken, refresh_token: refreshToken })
		} catch (err) {
			next(err)
		}
	},
}

export default AuthController
