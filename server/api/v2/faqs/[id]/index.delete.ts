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
		const result = await prisma.faq.delete({
			where: { id },
		});
		return sendResponse({
			event,
			message: 'Successfully deleted FAQ',
			data: result,
		});
	} catch (error) {
		console.log(error);
		return errorResponse({ event, error });
	}
});
