import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { H3Event } from 'h3';
import errorResponse from '~/utils/errorResponse';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const { address, q, offset } = getQuery(event);

	try {
		let query = db.collection('residents').orderBy('fullname', 'asc');
		const countSnap = await query.count().get();

		if (address) {
			const addressArray = Array.isArray(address) ? address : [address];
			query = query.where('address', 'in', addressArray);
		}

		if (q) {
			query = query.where('searchKeywords', 'array-contains', q).limit(3);
		} else {
			query = query.limit(10);
		}

		if (offset) {
			query = query.offset(Number(offset));
		}

		const residentsSnapshot = await query.get();
		const residents = residentsSnapshot.docs.map((doc) => ({
			uid: doc.id,
			...doc.data(),
		}));

		return okResponse({ data: residents, total: countSnap.data().count });
	} catch (error: any) {
		console.log('residents.get', error);
		return errorResponse(error);
	}
});
