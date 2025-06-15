import { getFirestore } from 'firebase-admin/firestore';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	try {
		const snapshot = await db.collection('notifications').get();

		const batch = db.batch();
		snapshot.docs.forEach((doc) => {
			const docRef = doc.ref;
			batch.set(docRef, { isRead: true }, { merge: true });
		});

		await batch.commit();

		return successResponse({ message: 'All notifications marked as read.' });
	} catch (error: any) {
		return errorResponse({ error, event });
	}
});
