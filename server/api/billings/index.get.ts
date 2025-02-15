import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { H3Event } from 'h3';
import errorResponse from '~/utils/errorResponse';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const { q, month, active } = getQuery(event);

	try {
		const countSnap = await db.collection('residents').count().get();

		const now = new Date();
		const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		const endOfMonth = new Date(
			now.getFullYear(),
			now.getMonth() + 1,
			0,
			23,
			59,
			59,
			999,
		);

		const startTimestamp = Timestamp.fromDate(startOfMonth);
		const endTimestamp = Timestamp.fromDate(endOfMonth);

		const billingsQuery = db
			.collectionGroup('billings')
			.where('createdAt', '>=', startTimestamp)
			.where('createdAt', '<=', endTimestamp);
		const querySnapshot = await billingsQuery.get();

		const billings = querySnapshot.docs.map((doc) => ({
			uid: doc.id,
			...doc.data(),
		}));

		return okResponse({ data: billings, total: countSnap.data().count });
	} catch (error: any) {
		console.log('billings.get', error);
		return errorResponse(error);
	}
});
