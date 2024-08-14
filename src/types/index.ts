export type storeTransactionBody = {
	amount: number
	categoryId: number
	title: string
	decoded: { userId: number }
}
