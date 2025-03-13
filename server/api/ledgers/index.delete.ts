import { getFirestore } from 'firebase-admin/firestore';
import { H3Event } from 'h3';
import errorResponse from '~/utils/errorResponse';
import successResponse from '~/utils/successResponse';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const ledgers = await readBody(event);
	try {
		const batch = db.batch();

		ledgers.forEach((item: any) => {
			const ledgerRef = db.collection('ledgers').doc(item.uid);

			batch.delete(ledgerRef);
		});

		await batch.commit();

		return successResponse({
			message: 'Succesfully deleted ledgers',
		});
	} catch (error) {
		console.log(error);
		return errorResponse(error);
	}
});
