import { Prisma } from '@prisma/client';
import { H3Event } from 'h3';
import { prisma } from '~~/prisma/client';

export default defineEventHandler(async (event: H3Event) => {
	const query = getQuery(event);
	const page = Number(query.page) || 1;
	const limit = Number(query.limit) || 10;
	const search = query.q?.toString();
	const book = query.address?.toString();

	const where: any = {
		AND: [
			{
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
			},
		],
	};

	if (book) {
		where.AND.push({
			book: { equals: book as string },
		});
	}

	const [residents, total] = await Promise.all([
		prisma.resident.findMany({
			where,
			skip: (page - 1) * limit,
			take: limit,
			orderBy: { createdAt: 'desc' },
		}),
		prisma.resident.count({ where }),
	]);

	return sendResponse({
		event,
		message: 'Retrieved Successfully',
		data: residents,
		meta: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	});
});
