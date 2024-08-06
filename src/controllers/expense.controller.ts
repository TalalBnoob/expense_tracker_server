import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import { prisma } from '../config'
import { Decimal } from '@prisma/client/runtime/library'

class expenseController {
	static async create(req: Request, res: Response, next: NextFunction) {
		try {
			const userId: number = req.body.decoded.userId
			const amount: Decimal = req.body.amount
			const title: string = req.body.title
			const categoryId: number = req.body.categoryId

			if (!amount || !title || !userId || !categoryId)
				createHttpError.BadRequest()

			const checkCategory = await prisma.category.findFirst({
				where: { id: categoryId },
			})

			if (!checkCategory) createHttpError.BadRequest()

			const checkAmount = await prisma.user.findUnique({
				where: {
					id: userId,
				},
			})

			if (checkAmount) {
				if (amount > checkAmount?.amount) createHttpError.BadRequest()
				else {
					await prisma.transaction.create({
						data: {
							authorId: userId,
							amount: amount,
							title: title,
							categoryId: categoryId,
							isExpense: true,
						},
					})
				}
			}
			next()
		} catch (err) {
			next(err)
		}
	}
}

export default expenseController
