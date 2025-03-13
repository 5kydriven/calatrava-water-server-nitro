import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const { q, month, active, offset = 0 } = getQuery(event);

	if (!month) {
		throw createError({
			statusCode: 404,
			statusMessage: 'bad request',
			message: 'Month is required',
		});
	}

	try {
		let collectionsQuery = db
			.collection('collections')
			.orderBy('createdAt', 'asc');

		const countSnap = await collectionsQuery.count().get();

		if (q) {
			collectionsQuery = collectionsQuery
				.where('accountno', '>=', q)
				.where('accountno', '<=', q)
				.limit(3);
		} else {
			collectionsQuery = collectionsQuery.limit(10);
		}

		if (offset) {
			collectionsQuery = collectionsQuery.offset(Number(offset));
		}

		const collectionsSnap = await collectionsQuery.get();

		const collections = collectionsSnap.docs.map((doc, index) => ({
			uid: doc.id,
			...doc.data(),
			id: index + (Number(offset) + 1),
		}));

		return successResponse({
			data: collections,
			total: countSnap.data().count,
		});
	} catch (error: any) {
		console.log('collections.get', error);
		return errorResponse(error);
	}
});
