import { Prisma } from '@prisma/client';
import { prisma } from '~~/prisma/client';

export default defineEventHandler(async (event) => {
	const query = getQuery(event);

	const page = Number(query.page) || 1;
	const limit = Number(query.limit) || 10;
	const search = query.q?.toString();

	const where: Prisma.BillingWhereInput = {
		...(search && {
			OR: [
				{
					fullname: {
						contains: search,
						mode: 'insensitive' as Prisma.QueryMode,
					},
				},
				{
					accountno: {
						contains: search,
						mode: 'insensitive' as Prisma.QueryMode,
					},
				},
			],
		}),
	};

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
