import { getFirestore } from 'firebase-admin/firestore';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	try {
		const snapshot = await db
			.collection('notifications')
			.orderBy('createdAt', 'desc')
			.get();

		const count = await db
			.collection('notifications')
			.where('isRead', '==', 'false')
			.count()
			.get();

		const notifications = snapshot.docs.map((doc) => ({
			...doc.data(),
			uid: doc.id,
		}));

		return successResponse({
			data: notifications,
			total: count.data().count,
		});
	} catch (error: any) {
		return errorResponse(error);
	}
});
