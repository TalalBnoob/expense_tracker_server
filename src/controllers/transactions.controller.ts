import { Decimal } from '@prisma/client/runtime/library'
import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import { prisma } from '../config'

class transactionsController {
	static async show(req: Request, res: Response, next: NextFunction) {
		const userId: number = req.body.decoded.userId

		const allUserTransaction = await prisma.transaction.findMany({
			where: { authorId: userId },
			include: { category: true },
		})

		res.status(200)
		res.send({ status: 200, data: allUserTransaction })
	}

	static async store(req: Request, res: Response, next: NextFunction) {
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
						// TODO: make it dynamic expense => true || income => false
						isExpense: true,
					},
				})
				await prisma.user.update({
					where: { id: userId },
					data: { amount: Number(user.amount) - Number(amount) },
				})
			}
			res.send({ message: 'Transaction have been completed' })
		} catch (err) {
			next(err)
		}
	}

	static async destroy(req: Request, res: Response, next: NextFunction) {
		try {
			const userId: number = req.body.decoded.userId
			const transactionId = req.params.id

			const transaction = await prisma.transaction.findUnique({
				where: {
					id: Number(transactionId),
				},
			})

			const owner = await prisma.user.findUnique({ where: { id: userId } })

			if (!transaction) throw createHttpError.NotFound('No transaction with this id')
			if (!owner) throw createHttpError.NotFound('User not found')
			if (!(transaction.authorId === userId)) throw createHttpError.Unauthorized()

			await prisma.user.update({
				where: {
					id: owner.id,
				},
				data: {
					// TODO: should check if it expens or income to knew wither sub the amount or sum it
					amount: Number(owner.amount) + Number(transaction.amount),
				},
			})

			await prisma.transaction.delete({ where: transaction })
			res.send({ message: 'Transaction have been deleted' })
		} catch (err) {
			next(err)
		}
	}
}

export default transactionsController
