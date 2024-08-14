import createHttpError from 'http-errors'
import z, { number } from 'zod'
import { prisma } from '../config'
import { storeTransactionBody } from '../types'

export const userSchema = z.object({
	email: z.string().email().toLowerCase(),
	password: z.string().min(8),
})

export function createAuthValidation(body: { email: string; password: string }) {
	const result = userSchema.safeParse(body)

	if (!result.success) throw createHttpError.BadRequest('Invalid data provided')

	const email = result.data?.email as string
	const password = result.data?.password as string

	return { email, password }
}

export const storeTransactionSchema = z.object({
	decoded: z.object({ userId: z.number() }),
	title: z.string(),
	amount: z.number(),
	categoryId: number(),
})

export async function storeTransactionValidation(body: storeTransactionBody) {
	const result = storeTransactionSchema.safeParse(body)

	if (!result.success) throw createHttpError.BadRequest('Invalid Data provided')
	const { amount, categoryId, decoded, title } = result.data

	const isCategoryExited = await prisma.category.findUnique({
		where: { id: categoryId },
	})

	if (!isCategoryExited) throw createHttpError.BadRequest('Category dose not exited')

	return { amount, categoryId, title, decoded }
}

// const userId: number = req.body.decoded.userId
// const title: string | null = req.body.title ?? null
// const amount: number | null = req.body.amount ?? null
// const categoryId: number | null = req.body.categoryId ?? null
// const note: string | null = req.body.note ?? null

export const updateTransactionSchema = z.object({
	decoded: z.object({ userId: z.number() }),
	title: z.string().nullable(),
	amount: z.number().nullable(),
	categoryId: number().nullable(),
	note: z.string().nullable(),
})

export async function updateTransactionValidation(body: storeTransactionBody) {
	const result = updateTransactionSchema.parse(body)

	// if (!result.success) throw createHttpError.BadRequest('Invalid Data provided')

	const { amount, categoryId, decoded, note, title } = result

	if (categoryId) {
		const isCategoryExited = await prisma.category.findUnique({
			where: { id: categoryId },
		})

		if (!isCategoryExited) throw createHttpError.BadRequest('Category dose not exited')
	}

	return { amount, title, categoryId, note, decoded }
}
