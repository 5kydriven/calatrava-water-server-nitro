import { Coordinate } from '@prisma/client';
import { prisma } from '~~/prisma/client';

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, 'id');
	const body = await readBody<Coordinate>(event);

	if (!id) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Bad Request',
			message: 'Required ID',
		});
	}
	if (!body) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Bad Request',
			message: 'Required body',
		});
	}

	try {
		const result = await prisma.coordinate.update({
			where: { id },
			data: {
				lat: body.lat,
				lng: body.lng,
				name: body.name,
			},
		});
		return sendResponse({
			event,
			message: 'Successfully updated coordinate',
			data: result,
		});
	} catch (error) {
		return errorResponse({ event, error });
	}
});
