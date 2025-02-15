import { getFirestore } from 'firebase-admin/firestore';
import { H3Event } from 'h3';
import errorResponse from '~/utils/errorResponse';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const uid = getRouterParam(event, 'uid');

	try {
		const billingsRef = db
			.collection('residents')
			.doc(uid)
			.collection('billings')
			.orderBy('createdAt', 'desc');

		const countSnapshot = await billingsRef.count().get();

		const snapshot = await billingsRef.get();
		const billings = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		return okResponse({ data: billings, total: countSnapshot.data().count });
	} catch (error: any) {
		console.log('billings/[uid].get', error);
		return errorResponse(error);
	}
});
