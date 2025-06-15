import { Prisma } from '@prisma/client';
import { H3Event } from 'h3';
import { prisma } from '~~/prisma/client';

export default defineEventHandler(async (event: H3Event) => {
	const query = getQuery(event);

	const page = Number(query.page) || 1;
	const limit = Number(query.limit) || 10;
	const search = query.q?.toString();

	const where: Prisma.LedgerWhereInput = {
		...(search && {
			OR: [
				{
					accountno: {
						contains: search,
						mode: 'insensitive' as Prisma.QueryMode,
					},
				},
			],
		}),
	};

	const [ledgers, total] = await Promise.all([
		prisma.ledger.findMany({
			where,
			skip: (page - 1) * limit,
			take: limit,
			orderBy: { createdAt: 'desc' },
		}),
		prisma.ledger.count({ where }),
	]);

	return sendResponse({
		event,
		message: 'Retrieved Successfully',
		data: ledgers,
		meta: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	});
});
