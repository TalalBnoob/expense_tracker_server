import { prisma } from '../src/config'

async function main() {
	await prisma.category.createMany({
		data: [
			{
				title: 'Groceries',
			},
			{
				title: 'Leisure',
			},
			{
				title: 'Electronics',
			},
			{
				title: 'Utilities',
			},
			{
				title: 'Clothing',
			},
			{
				title: 'Health',
			},
			{
				title: 'Others',
			},
		],
	})

	await prisma.user.create({
		data: {
			email: 'test@test.com',
			password: 'test',
		},
	})
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
