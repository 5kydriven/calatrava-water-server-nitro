import { prisma } from '~~/prisma/client';

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, 'id');
	if (!id) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Bad Request',
			message: 'Required ID',
		});
	}

	try {
		const result = await prisma.coordinate.findUnique({
			where: { id },
		});
		return sendResponse({ event, data: result });
	} catch (error) {
		return errorResponse({ event, error });
	}
});
