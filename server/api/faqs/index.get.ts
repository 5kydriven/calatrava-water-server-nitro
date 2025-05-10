import { getFirestore } from 'firebase-admin/firestore';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const { limit = 10, offset } = getQuery(event);
	try {
		const snapshot = await db
			.collection('faqs')
			.orderBy('createdAt', 'desc')
			// .limit(limit as number)
			.get();

		const count = await db.collection('faqs').count().get();

		const concerns = snapshot.docs.map((doc) => ({
			...doc.data(),
			uid: doc.id,
		}));

		return successResponse({
			data: concerns,
			total: count.data().count,
		});
	} catch (error: any) {
		return errorResponse(error);
	}
});
