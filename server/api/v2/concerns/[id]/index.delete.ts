import { prisma } from '~~/prisma/client';

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, 'id');

	if (!id) {
		throw createError({
			statusCode: 400,
			statusMessage: 'bad request',
			message: 'Required id',
		});
	}
	try {
		const concern = await prisma.concern.delete({
			where: { id },
		});
		return sendResponse({
			event,
			message: 'Successfully deleted concern',
			data: concern,
		});
	} catch (error) {
		console.log(error);
		return errorResponse({ event, error });
	}
});
