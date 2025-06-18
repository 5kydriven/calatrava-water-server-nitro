import { H3Event } from 'h3';
import { prisma } from '~~/prisma/client';

export default defineEventHandler(async (event: H3Event) => {
	const id = getRouterParam(event, 'id');
	try {
		const result = await prisma.resident.findUnique({
			where: { id },
			include: {
				billings: {
					orderBy: { createdAt: 'desc' },
				},
			},
		});

		return sendResponse({ event, data: result });
	} catch (error) {
		return errorResponse({ event, error });
	}
});
