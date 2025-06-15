import { getAuth } from 'firebase-admin/auth';
import { H3Event } from 'h3';
import { prisma } from '~~/prisma/client';

export default defineEventHandler(async (event: H3Event) => {
	const id = getRouterParam(event, 'id');
	const auth = getAuth();
	try {
		const result = await prisma.resident.findUnique({
			where: { id },
		});
		if (!result) {
			throw createError({
				statusCode: 401,
				statusMessage: 'Unauthorized',
				message: 'Invalid account number',
			});
		}

		const token = await auth.createCustomToken(id);

		return sendResponse({
			event,
			message: 'Token created',
			data: token,
		});
	} catch (error: any) {
		console.log(error);
		return errorResponse({ event, error });
	}
});
