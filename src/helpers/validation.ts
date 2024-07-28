import z from 'zod'

export const userSchema = z.object({
	email: z.string().email().toLowerCase(),
	password: z.string().min(8),
})
