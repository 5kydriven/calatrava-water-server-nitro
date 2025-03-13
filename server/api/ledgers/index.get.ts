import { getFirestore } from 'firebase-admin/firestore';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const { q, month, offset = 0 } = getQuery(event);
	try {
		let ledgerQuery = db.collection('ledgers').orderBy('sequence', 'asc');

		if (q) {
			ledgerQuery = ledgerQuery
				.where('accountno', '>=', q)
				.where('accountno', '<=', q)
				.limit(3);
		} else {
			ledgerQuery = ledgerQuery.limit(10);
		}

		if (offset) {
			ledgerQuery = ledgerQuery.offset(Number(offset));
		}

		const ledgerSnapshot = await ledgerQuery.get();
		const countSnap = await ledgerQuery.count().get();

		const ledgers = ledgerSnapshot.docs.map((doc, index) => ({
			uid: doc.id,
			...doc.data(),
			id: index + (Number(offset) + 1),
		}));

		return successResponse({ data: ledgers, total: countSnap.data().count });
	} catch (error) {
		console.log(error);
		return errorResponse(error);
	}
});
