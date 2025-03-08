import { getFirestore } from 'firebase-admin/firestore';
import { H3Event } from 'h3';
import errorResponse from '~/utils/errorResponse';
import successResponse from '~/utils/okResponse';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const uid = getRouterParam(event, 'uid');
	try {
		const ledgerSnap = await db.collection('ledgers').doc(uid).delete();

		return successResponse({
			message: 'Succesfully deleted ledgers',
			data: ledgerSnap,
		});
	} catch (error) {
		console.log(error);
		return errorResponse(error);
	}
});
