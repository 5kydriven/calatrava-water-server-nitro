import { Prisma } from '@prisma/client';
import { prisma } from '~~/prisma/client';

export default defineEventHandler(async (event) => {
	const query = getQuery(event);

	const page = Number(query.page) || 1;
	const limit = Number(query.limit) || 10;
	const search = query.q?.toString();

	try {
		const where: Prisma.ConcernWhereInput = {
			...(search && {
				OR: [
					{
						name: {
							contains: search,
							mode: 'insensitive' as Prisma.QueryMode,
						},
					},
				],
			}),
		};

		const [concerns, total] = await Promise.all([
			prisma.concern.findMany({
				where,
				skip: (page - 1) * limit,
				take: limit,
				orderBy: { createdAt: 'desc' },
			}),
			prisma.concern.count({ where }),
		]);

		return sendResponse({
			event,
			data: concerns,
			meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
		});
	} catch (error) {
		console.log(error);
		return errorResponse({ event, error });
	}
});
