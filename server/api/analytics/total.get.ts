import { getFirestore } from 'firebase-admin/firestore';
import { H3Event } from 'h3';
import successResponse from '~/utils/okResponse';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	try {
		const residentsSnap = await db.collection('residents').count().get();
		const billingsSnap = await db.collectionGroup('billings').count().get();

		return successResponse({
			data: {
				residents: residentsSnap.data().count,
				bills: billingsSnap.data().count,
			},
		});
	} catch (error: any) {
		return errorResponse(error);
	}
});
