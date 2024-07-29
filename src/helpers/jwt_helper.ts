import jwt from 'jsonwebtoken'
import { prisma } from '../config'
import createHttpError from 'http-errors'

/*

// Access Tokens

*/
export const accessTokenSing = async (userId: number) => {
	const accessToken = await jwt.sign({ userId }, process.env.AUTH_ACCESS_TOKEN_SECRET as string, {
		expiresIn: '15m',
	})
	return accessToken
}

export const accessTokenVerify = (token: string) => {
	const userId = jwt.verify(token, process.env.AUTH_ACCESS_TOKEN_SECRET as string, {})
	console.log(userId)
	return userId
}

/*

// Refresh Tokens

*/
export const refreshTokenSing = async (userId: number) => {
	const refreshToken = await jwt.sign({ userId }, process.env.AUTH_REFRESH_TOKEN_SECRET as string, {
		expiresIn: '1y',
	})
	return refreshToken
}

export const refreshTokenVerify = async (token: string) => {
	try {
		jwt.verify(token, process.env.AUTH_ACCESS_TOKEN_SECRET as string, {})
		await prisma.token.findUniqueOrThrow({
			where: {
				refresh_token: token,
			},
		})
	} catch (err) {
		return createHttpError.Unauthorized()
	}

	return jwt.decode(token)
}

/*

// Set Tokens

*/
export async function setUserTokens(userId: number) {
	const accessToken = await accessTokenSing(userId)
	const refreshToken = await refreshTokenSing(userId)

	const doseExist = await prisma.token.findUnique({
		where: {
			user_id: userId,
		},
	})

	if (!doseExist) {
		await prisma.token.create({ data: { refresh_token: refreshToken, user_id: userId } })
	} else {
		await prisma.token.update({ where: { user_id: userId }, data: { refresh_token: refreshToken } })
	}
	return { accessToken: accessToken, refreshToken: refreshToken }
}
