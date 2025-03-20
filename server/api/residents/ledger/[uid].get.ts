import { getFirestore } from 'firebase-admin/firestore';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const uid = getRouterParam(event, 'uid');
	try {
		const ledgerSnap = await db
			.collection('ledgers')
			.where('accountno', '==', uid)
			.orderBy('createdAt', 'desc')
			.get();

		// Process the query results
		const ledgers = ledgerSnap.docs.map((doc) => ({
			uid: doc.id,
			...doc.data(),
		}));

		return successResponse({ data: ledgers });
	} catch (error: any) {
		return errorResponse(error);
	}
});
