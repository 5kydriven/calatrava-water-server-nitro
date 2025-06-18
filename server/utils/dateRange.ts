export function getMonthDateRange(month: string): {
	startDate: string;
	endDate: string;
} {
	const [year, monthNum] = month.split('-');
	const paddedMonth = monthNum.padStart(2, '0');

	const startDate = `${paddedMonth}/01/${year}`;
	const lastDay = new Date(Number(year), Number(monthNum), 0).getDate();
	const endDate = `${paddedMonth}/${lastDay}/${year}`;

	return { startDate, endDate };
}
