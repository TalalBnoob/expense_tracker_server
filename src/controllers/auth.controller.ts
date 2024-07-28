import { NextFunction, Request, Response } from 'express'
import { userSchema } from '../helpers/validation'
import createHttpError from 'http-errors'
import bcrypt from 'bcryptjs'
import jwt_helper from '../helpers/jwt_helper'
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
				},
			})

			const access_token = await jwt_helper.accessTokenSing(String(newUser.id))
			const refresh_token = await jwt_helper.refreshTokenSing(String(newUser.id))
			await prisma.token.create({ data: { refresh_token: refresh_token, user_id: newUser.id } })
			res.send({ access_token: access_token, refresh_token: refresh_token, user: newUser })
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

			const access_token = await jwt_helper.accessTokenSing(String(userInfo.id))
			const refresh_token = await jwt_helper.refreshTokenSing(String(userInfo.id))
			await prisma.token.update({ where: { user_id: userInfo.id }, data: { refresh_token: refresh_token } })
			res.send({ access_token: access_token, refresh_token: refresh_token })
		} catch (err) {
			next(err)
		}
	},
}

export default AuthController
