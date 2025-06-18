import { prisma } from '~~/prisma/client';

export default defineEventHandler(async (event) => {
	const query = getQuery(event);

	const page = Number(query.page) || 1;
	const limit = Number(query.limit) || 10;
	try {
		const [faqs, total] = await Promise.all([
			prisma.faq.findMany({
				skip: (page - 1) * limit,
				take: limit,
				orderBy: { createdAt: 'desc' },
			}),
			prisma.faq.count(),
		]);

		return sendResponse({
			event,
			data: faqs,
			meta: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		console.log(error);
		return errorResponse({ event, error });
	}
});
