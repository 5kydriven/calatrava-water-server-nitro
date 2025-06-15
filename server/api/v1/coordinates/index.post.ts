import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const body = await readBody(event);
	try {
		if (!body) {
			throw createError({
				statusCode: 400,
				statusMessage: 'bad request',
				message: 'Required body',
			});
		}

		const docRef = await db
			.collection('coordinates')
			.add({ ...body, createdAt: Timestamp.now() });

		return successResponse({
			message: 'Successfully created coordinate',
			data: docRef,
		});
	} catch (error: any) {
		return errorResponse({ error, event });
	}
});
