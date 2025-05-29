import { getFirestore } from 'firebase-admin/firestore';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const params = getRouterParam(event, 'uid');

	try {
		let remindersSnap = await db
			.collection('reminders')
			.orderBy('createdAt', 'desc')
			.where('residentUid', '==', params)
			.limit(1)
			.get();

		// Process the query results
		const reminders = remindersSnap.docs.map((doc) => ({
			uid: doc.id,
			...doc.data(),
		}));

		return successResponse({ data: reminders });
	} catch (error: any) {
		return errorResponse(error);
	}
});
