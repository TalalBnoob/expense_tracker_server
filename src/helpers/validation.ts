import createHttpError from 'http-errors'
import z from 'zod'

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
