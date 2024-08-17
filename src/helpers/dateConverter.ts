export function convertDate(date: string | undefined): number {
	if (!date) return 0

	const currantDate = new Date()

	switch (date) {
		case 'w':
			return currantDate.setDate(currantDate.getDate() - 7)
			break

		case '2w':
			return currantDate.setDate(currantDate.getDate() - 14)
			break

		case 'm':
			return currantDate.setDate(currantDate.getMonth() - 1)
			break

		case '3m':
			return currantDate.setDate(currantDate.getMonth() - 3)
			break

		case '6m':
			return currantDate.setDate(currantDate.getMonth() - 6)
			break

		case 'y':
			return currantDate.setDate(currantDate.getMonth() - 12)
			break
	}

	return 0
}
