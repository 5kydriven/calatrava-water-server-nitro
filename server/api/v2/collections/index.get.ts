import { Prisma } from '@prisma/client';
import { H3Event } from 'h3';
import { getMonthDateRange } from '~/utils/dateRange';
import { prisma } from '~~/prisma/client';

export default defineEventHandler(async (event: H3Event) => {
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
			pymtdate: {
				gte: startDate,
				lte: endDate,
			},
		});
	}

	const [collections, total] = await Promise.all([
		prisma.collection.findMany({
			where,
			skip: (page - 1) * limit,
			take: limit,
			orderBy: { createdAt: 'desc' },
		}),
		prisma.collection.count({ where }),
	]);

	return sendResponse({
		event,
		message: 'Retrieved Successfully',
		data: collections,
		meta: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	});
});
