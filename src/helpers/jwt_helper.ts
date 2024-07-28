import jwt from 'jsonwebtoken'

export default {
	accessTokenSing: async (userId: string) => {
		const accessToken = await jwt.sign({ userId }, process.env.AUTH_ACCESS_TOKEN_SECRET as string, {
			expiresIn: '15m',
		})
		return accessToken
	},
	accessTokenVerify: (token: string) => {
		const userId = jwt.verify(token, process.env.AUTH_ACCESS_TOKEN_SECRET as string, {})
		console.log(userId)
		return userId
	},
	refreshTokenSing: async (userId: string) => {
		const refreshToken = await jwt.sign({ userId }, process.env.AUTH_REFRESH_TOKEN_SECRET as string, {
			expiresIn: '1y',
		})
		return refreshToken
	},
}
