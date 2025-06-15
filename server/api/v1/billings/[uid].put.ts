import { getFirestore } from 'firebase-admin/firestore';
import { H3Event } from 'h3';
import errorResponse from '~/utils/errorResponse';
import successResponse from '~/utils/successResponse';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const uid = getRouterParam(event, 'uid');
	const body = await readBody(event);
	try {
		const subBillingSnap = await db
			.collection('residents')
			.doc(body.accountno)
			.collection('billings')
			.doc(uid)
			.set({ ...body }, { merge: true });

		const billingSnap = await db
			.collection('billings')
			.doc(uid)
			.set({ ...body }, { merge: true });

		return successResponse({
			message: 'Succesfully updated billing',
			data: [billingSnap, subBillingSnap],
		});
	} catch (error) {
		return errorResponse({ error, event });
	}
});
