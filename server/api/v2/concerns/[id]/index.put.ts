import { Concern } from '@prisma/client';
import { prisma } from '~~/prisma/client';

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, 'id');
	const concern = await readBody<Concern>(event);
	try {
		const result = await prisma.concern.update({
			where: { id },
			data: {
				...concern,
			},
		});

		return sendResponse({
			event,
			message: 'Successfully updated concern',
			data: result,
		});
	} catch (error) {
		console.log(error);
		return errorResponse({ event, error });
	}
});
