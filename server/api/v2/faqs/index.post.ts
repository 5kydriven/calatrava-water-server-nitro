import { faq } from '@prisma/client';
import { prisma } from '~~/prisma/client';

export default defineEventHandler(async (event) => {
	const body = await readBody<faq>(event);

	if (!body) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Bad Request',
			message: 'Required body',
		});
	}
	try {
		const result = await prisma.faq.create({
			data: {
				answer: body.answer,
				question: body.question,
			},
		});

		return sendResponse({
			event,
			message: 'Successfully created FAQ',
			data: result,
		});
	} catch (error) {
		console.log(error);
		return errorResponse({ event, error });
	}
});
