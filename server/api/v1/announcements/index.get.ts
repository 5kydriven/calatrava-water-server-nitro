import { getFirestore } from 'firebase-admin/firestore';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const { isAll } = getQuery(event);

	try {
		let announcementRef = db
			.collection('announcements')
			.orderBy('createdAt', 'desc');

		// Execute the query and get the results
		const snapshot = await (isAll == 'true'
			? announcementRef.get()
			: announcementRef.limit(1).get());

		// Process the query results
		const announcements = snapshot.docs.map((doc) => ({
			uid: doc.id,
			...doc.data(),
		}));

		return successResponse({ data: announcements });
	} catch (error: any) {
		return errorResponse({ error, event });
	}
});
