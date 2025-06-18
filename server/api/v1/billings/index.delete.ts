import { getFirestore } from 'firebase-admin/firestore';
import { H3Event } from 'h3';
import errorResponse from '~/utils/errorResponse';
import successResponse from '~/utils/successResponse';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const billings = await readBody(event);
	if (!billings) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Bad Request',
			message: 'Required body',
		});
	}
	try {
		const batch = db.batch();

		billings.forEach((item: any) => {
			const subBillingRef = db
				.collection('residents')
				.doc(item.residentId)
				.collection('billings')
				.doc(item.uid);

			const billingRef = db.collection('billings').doc(item.uid);

			batch.delete(subBillingRef);
			batch.delete(billingRef);
		});

		await batch.commit();

		return successResponse({
			message: 'Successfully deleted billings',
		});
	} catch (error) {
		console.error('Error deleting billings:', error);
		return errorResponse({ error, event });
	}
});
