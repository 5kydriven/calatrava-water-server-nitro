import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const uid = getRouterParam(event, 'uid');

	try {
		const snapshot = await db.collection('faqs').doc(uid).delete();

		return successResponse({
			data: snapshot,
			message: 'Successfully deleted FAQ',
		});
	} catch (error: any) {
		return errorResponse(error);
	}
});
