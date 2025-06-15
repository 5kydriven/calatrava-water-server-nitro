import { Coordinate } from '@prisma/client';
import { prisma } from '~~/prisma/client';

export default defineEventHandler(async (event) => {
	const body = await readBody<Coordinate>(event);
	try {
		const result = await prisma.coordinate.create({
			data: {
				lat: body.lat,
				lng: body.lng,
				name: body.name,
			},
		});
		return sendResponse({
			event,
			message: 'Successfully created coordinate',
			data: result,
		});
	} catch (error) {
		return errorResponse({ event, error });
	}
});
