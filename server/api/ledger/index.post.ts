import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { H3Event } from 'h3';
import successResponse from '~/utils/okResponse';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const body = await readBody(event);

	if (!body) {
		return errorResponse({
			statusCode: 204,
			statusMessage: 'no content',
			message: 'Request cannot be empty',
		});
	}

	if (Array.isArray(body) && body.length === 0) {
		return errorResponse({
			statusCode: 400,
			statusMessage: 'bad request',
			message: 'Request body array cannot be empty.',
		});
	}

	try {
		const ledgerList = Array.isArray(body) ? body : [body];
		const batch = db.batch();
		const ledgerRef = db.collection('ledger').doc();

		for (const item of ledgerList) {
			batch.set(ledgerRef, {
				...item,
				createdAt: Timestamp.now(),
			});
		}

		await batch.commit();

		return successResponse({ message: 'Successfully added ledger' });
	} catch (error) {
		console.log(error);
		return errorResponse(error);
	}
});
