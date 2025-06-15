import { Anouncement } from '@prisma/client';
import { prisma } from '~~/prisma/client';

export default defineEventHandler(async (event) => {
	const body = await readBody<Anouncement>(event);
	if (!body) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Bad Request',
			message: 'Required body',
		});
	}
	try {
		const result = await prisma.anouncement.create({
			data: {
				content: body.content,
				dueDate: body.dueDate,
				target: body.target,
				type: body.type,
			},
		});
		return sendResponse({
			event,
			message: 'Successfully created announcement',
			data: result,
		});
	} catch (error) {
		console.log(error);
		return errorResponse({ event, error });
	}
});
