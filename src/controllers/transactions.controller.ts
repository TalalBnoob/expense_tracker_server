import { Decimal } from '@prisma/client/runtime/library'
import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import { prisma } from '../config'

class transactionsController {
	static async create(req: Request, res: Response, next: NextFunction) {
		try {
			const userId: number = req.body.decoded.userId
			const amount: Decimal = req.body.amount
			const title: string = req.body.title
			const categoryId: number = req.body.categoryId

			if (!amount || !title || !userId || !categoryId) throw createHttpError.BadRequest()

			const isCategoryExited = await prisma.category.findFirst({
				where: { id: categoryId },
			})

			if (!isCategoryExited) throw createHttpError.BadRequest('Category dose not exited')

			const user = await prisma.user.findUnique({
				where: {
					id: userId,
				},
			})

			if (user) {
				if (amount > user.amount) throw createHttpError.BadRequest("Don't have enough money to make the transaction")

				await prisma.transaction.create({
					data: {
						authorId: userId,
						amount: amount,
						title: title,
						categoryId: categoryId,
						isExpense: true,
					},
				})
				await prisma.user.update({
					where: { id: userId },
					data: { amount: Number(user.amount) - Number(amount) },
				})
			}
			console.log('Right Here')
		} catch (err) {
			next(err)
		}
	}
}

export default transactionsController
