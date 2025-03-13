import { getFirestore } from 'firebase-admin/firestore';
import { H3Event } from 'h3';
import errorResponse from '~/utils/errorResponse';
import successResponse from '~/utils/successResponse';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const uid = getRouterParam(event, 'uid');
	const residentUid = await readBody(event);
	try {
		const subBillingSnapshot = await db
			.collection('residents')
			.doc(residentUid)
			.collection('billings')
			.doc(uid)
			.delete();

		const billingSnapshot = await db.collection('billings').doc(uid).delete();

		return successResponse({
			message: 'Succesfully deleted billing',
			data: [subBillingSnapshot, billingSnapshot],
		});
	} catch (error) {
		console.log(error);
		return errorResponse(error);
	}
});
