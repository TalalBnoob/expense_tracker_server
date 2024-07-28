import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../config'
import { Prisma } from '@prisma/client/extension'

export default {
	hashPassword: async (password: string) => await bcrypt.hash(password, 10),
	...prisma.user,
}
