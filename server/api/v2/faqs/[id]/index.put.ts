import { faq } from '@prisma/client';
import { prisma } from '~~/prisma/client';

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, 'id');
	const body = await readBody<faq>(event);
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
		const result = await prisma.faq.update({
			where: { id },
			data: {
				question: body.question,
				answer: body.answer,
			},
		});

		return sendResponse({
			event,
			message: 'Successfully updated FAQ',
			data: result,
		});
	} catch (error) {
		console.log(error);
		return errorResponse({ event, error });
	}
});
