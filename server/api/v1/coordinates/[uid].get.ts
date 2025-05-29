import { getFirestore } from 'firebase-admin/firestore';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const uid = getRouterParam(event, 'uid');

	try {
		if (!uid) {
			throw createError({
				statusCode: 400,
				statusMessage: 'bad request',
				message: 'Required uid',
			});
		}

		const coordinate = await db.collection('coordinates').doc(uid).get();

		return successResponse({
			data: { ...coordinate.data(), uid: coordinate.id },
		});
	} catch (error: any) {
		return errorResponse(error);
	}
});
