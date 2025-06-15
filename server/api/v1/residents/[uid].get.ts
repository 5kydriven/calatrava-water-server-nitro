import { getFirestore } from 'firebase-admin/firestore';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const uid = getRouterParam(event, 'uid');
	try {
		const residentRef = db.collection('residents').doc(uid);
		const residentSnapshot = await residentRef.get();
		const residentBillings = await residentRef
			.collection('billings')
			.orderBy('createdAt', 'desc')
			.get();

		const billings = residentBillings.docs.map((doc) => ({
			uid: doc.id,
			...doc.data(),
		}));
		return successResponse({
			data: { ...residentSnapshot.data(), billings, uid: residentSnapshot.id },
		});
	} catch (error: any) {
		return errorResponse({ error, event });
	}
});
