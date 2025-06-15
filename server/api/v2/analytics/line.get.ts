import { format } from 'date-fns';
import { prisma } from '~~/prisma/client';

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	const year = query.year?.toString() || format(new Date(), 'yyyy');

	try {
		const months = Array.from({ length: 12 }, (_, i) => i + 1); // 1 to 12

		const results = await Promise.all(
			months.map(async (month) => {
				const paddedMonth = month.toString().padStart(2, '0');
				const startDate = `${paddedMonth}/01/${year}`;
				const lastDay = new Date(Number(year), month, 0).getDate();
				const endDate = `${paddedMonth}/${lastDay}/${year}`;

				const result = await prisma.billing.aggregate({
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

				return {
					month,
					total: result._sum.totalBill || 0,
				};
			}),
		);
		return sendResponse({
			event,
			message: 'Retrieved Successfully',
			data: results,
		});
	} catch (error) {
		console.log(error);
		return errorResponse({ event, error });
	}
});
