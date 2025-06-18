import { Prisma } from '@prisma/client';
import { getMonthDateRange } from '~/utils/dateRange';
import { prisma } from '~~/prisma/client';

export default defineEventHandler(async (event) => {
	const query = getQuery(event);

	const page = Number(query.page) || 1;
	const limit = Number(query.limit) || 10;
	const search = query.q?.toString();
	const month = query.month.toString();

	const { startDate, endDate } = getMonthDateRange(month);

	const where: any = {
		AND: [
			...(search
				? [
						{
							OR: [
								{
									fullname: {
										contains: search,
										mode: 'insensitive',
									},
								},
								{
									accountno: {
										contains: search,
										mode: 'insensitive',
									},
								},
							],
						},
				  ]
				: []),
		],
	};

	if (month) {
		where.AND.push({
			bill_date: {
				gte: startDate,
				lte: endDate,
			},
		});
	}

	const [billings, total] = await Promise.all([
		prisma.billing.findMany({
			where,
			skip: (page - 1) * limit,
			take: limit,
			orderBy: { createdAt: 'desc' },
		}),
		prisma.billing.count({ where }),
	]);

	return sendResponse({
		event,
		message: 'Billings retrieved successfully',
		data: billings,
		meta: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	});
});
