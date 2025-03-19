import { getFirestore } from 'firebase-admin/firestore';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const params = getRouterParam(event, 'uid');
	const { isAll } = getQuery(event);

	try {
		let remindersRef = db
			.collection('reminders')
			.orderBy('createdAt', 'desc')
			.where('residentUid', '==', params);

		// Execute the query and get the results
		const snapshot = await (isAll == 'true'
			? remindersRef.get()
			: remindersRef.limit(1).get());

		// Process the query results
		const reminders = snapshot.docs.map((doc) => ({
			uid: doc.id,
			...doc.data(),
		}));

		return successResponse({ data: reminders });
	} catch (error: any) {
		return errorResponse(error);
	}
});
