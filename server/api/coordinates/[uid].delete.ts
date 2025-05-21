import { getFirestore, Timestamp } from 'firebase-admin/firestore';
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

		const docRef = await db.collection('coordinates').doc(uid).delete();

		return successResponse({
			message: 'Successfully deleted coordinate',
			data: docRef,
		});
	} catch (error: any) {
		return errorResponse(error);
	}
});
