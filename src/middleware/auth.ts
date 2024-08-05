import { NextFunction, Request, Response } from 'express'
import { accessTokenVerify } from '../helpers/jwt_helper'
import createHttpError from 'http-errors'

export default (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.headers.authorization)
			throw createHttpError.Unauthorized('No token has been provided')

		const token = req.headers.authorization.split(' ')[1]

		const decode = accessTokenVerify(token)
		req.body.decoded = decode
		next()
	} catch (err) {
		next(err)
	}

	next()
}
