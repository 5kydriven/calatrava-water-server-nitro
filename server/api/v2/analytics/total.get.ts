import { format } from 'date-fns';
import { prisma } from '~~/prisma/client';

export default defineEventHandler(async (event) => {
	try {
		const currentMonth = format(new Date(), 'yyyy-M');

		const [year, monthNum] = currentMonth.split('-');
		const paddedMonth = monthNum.padStart(2, '0');

		const startDate = `${paddedMonth}/01/${year}`;
		const lastDay = new Date(Number(year), Number(monthNum), 0).getDate();
		const endDate = `${paddedMonth}/${lastDay}/${year}`;

		const residents = await prisma.resident.count();

		const totalBilling = await prisma.billing.aggregate({
			_sum: { totalBill: true },
		});

		const currentMonthBilling = await prisma.billing.aggregate({
			where: {
				bill_date: {
					gte: startDate,
					lte: endDate,
				},
			},
			_sum: {
				totalBill: true,
			},
		});

		return sendResponse({
			event,
			message: '',
			data: {
				residents,
				totalIncome: totalBilling._sum.totalBill,
				currentMonthIncome: currentMonthBilling._sum.totalBill,
			},
		});
	} catch (error) {
		console.log(error);
		return errorResponse({ event, error });
	}
});
