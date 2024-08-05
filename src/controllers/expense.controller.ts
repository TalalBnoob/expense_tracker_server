import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import { prisma } from '../config'
import { Decimal } from '@prisma/client/runtime/library'

const expenseController = {
	create: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId: number = req.body.decoded.userId
			const amount: Decimal = req.body.amount
			const title: string = req.body.title
			const category: string = req.body.category

			if (!amount || !title || !userId || !category) createHttpError.BadRequest()

			const getCategory = await prisma.catagory.findUnique({ where: { title: category } })

			const checkAmount = await prisma.user.findUnique({
				where: {
					id: userId,
				},
			})

			if (checkAmount && getCategory) {
				if (amount > checkAmount?.amount) createHttpError.BadRequest()
				else
					prisma.expense.create({
						data: {
							title: title,
							authorId: userId,
							amount: amount,
							catagroyId: getCategory.id,
						},
					})
			}
		} catch (err) {
			next(err)
		}
	},
}

export default expenseController
