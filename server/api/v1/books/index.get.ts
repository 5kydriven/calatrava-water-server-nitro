import { getFirestore } from 'firebase-admin/firestore';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();

	try {
		const snapshot = await db.collection('books').doc('all_books').get();

		if (!snapshot.exists) {
			throw createError({
				statusCode: 404,
				statusMessage: 'Not Found',
				message: 'No books found',
			});
		}

		return successResponse({
			data: { ...snapshot.data(), uid: snapshot.id },
		});
	} catch (error: any) {
		console.error('books:get', error);
		return errorResponse({ error, event });
	}
});
