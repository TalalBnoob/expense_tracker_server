import { NextFunction, Request, Response } from 'express'
import jwt_helper from '../helpers/jwt_helper'
import jwt from 'jsonwebtoken'
import createHttpError from 'http-errors'

export default (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.headers.authorization) throw createHttpError.Unauthorized('No token has been provided')

		const token = req.headers.authorization.split(' ')[1]

		console.log(jwt.decode(token))
	} catch (err) {
		next(err)
	}

	next()
}
