import { getFirestore } from 'firebase-admin/firestore';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();

	try {
		let remindersSnap = await db
			.collection('reminders')
			.orderBy('createdAt', 'desc')
			.get();

		// Process the query results
		const reminders = remindersSnap.docs.map((doc) => ({
			uid: doc.id,
			...doc.data(),
		}));

		return successResponse({ data: reminders });
	} catch (error: any) {
		return errorResponse({ error, event });
	}
});
