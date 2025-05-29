import { getFirestore } from 'firebase-admin/firestore';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const uid = getRouterParam(event, 'uid');
	try {
		const collectionSnap = await db
			.collection('collections')
			.where('accountno', '==', uid)
			.orderBy('createdAt', 'desc')
			.get();

		// Process the query results
		const collections = collectionSnap.docs.map((doc) => ({
			uid: doc.id,
			...doc.data(),
		}));

		return successResponse({ data: collections });
	} catch (error: any) {
		return errorResponse(error);
	}
});
