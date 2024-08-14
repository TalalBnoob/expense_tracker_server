import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import { prisma } from '../config'
import { storeTransactionValidation, updateTransactionValidation } from '../helpers/validation'

class transactionsController {
	static async index(req: Request, res: Response, next: NextFunction) {
		const userId: number = req.body.decoded.userId

		const allUserTransaction = await prisma.transaction.findMany({
			where: { authorId: userId },
			select: {
				id: true,
				title: true,
				amount: true,
				date: true,
				note: true,
				author: { select: { email: true } },
				category: { select: { title: true } },
			},
		})

		res.status(200)
		res.send({ status: 200, data: allUserTransaction })
	}

	static async show(req: Request, res: Response, next: NextFunction) {
		const userId: number = req.body.decoded.userId
		const transactionId = req.params.id

		const transaction = await prisma.transaction.findUnique({
			where: {
				id: Number(transactionId),
			},
		})

		if (!transaction) throw createHttpError.NotFound('No transaction found')
		if (transaction.authorId !== userId) throw createHttpError.Unauthorized('Unauthorized transaction')

		res.status(200)
		res.send({
			status: 200,
			date: {
				transaction,
			},
		})
	}

	static async update(req: Request, res: Response, next: NextFunction) {
		try {
			const { amount, categoryId, decoded, note, title } = await updateTransactionValidation(req.body)
			const userId = decoded.userId
			const transactionId = req.params.id

			const user = await prisma.user.findUnique({ where: { id: userId } })
			const targetedTransaction = await prisma.transaction.findUnique({
				where: {
					id: Number(transactionId),
				},
			})

			if (!targetedTransaction) throw createHttpError.NotFound('Transaction not found')
			if (targetedTransaction.authorId !== user?.id) throw createHttpError.Unauthorized()

			if (title) targetedTransaction.title = title
			if (categoryId) targetedTransaction.categoryId = categoryId
			if (note) targetedTransaction.note = note
			if (amount && amount >= 0) {
				if (targetedTransaction.amount !== amount) {
					const deff = targetedTransaction.amount - amount // 1000 - 1200 = -200
					if (user.amount + deff >= 0) {
						await prisma.user.update({ where: { id: userId }, data: { amount: user.amount + deff } })
						targetedTransaction.amount = amount
					} else throw createHttpError.BadRequest("Don't have enough money to make the transaction")
				}
			}

			await prisma.transaction.update({
				where: {
					id: targetedTransaction.id,
				},
				data: targetedTransaction,
			})
			res.status(200)
			res.send('Update Completed')
		} catch (err) {
			next(err)
		}
	}

	static async store(req: Request, res: Response, next: NextFunction) {
		try {
			const { amount, categoryId, title, decoded } = await storeTransactionValidation(req.body)
			const { userId } = decoded

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
