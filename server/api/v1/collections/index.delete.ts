import { getFirestore } from 'firebase-admin/firestore';
import { H3Event } from 'h3';
import errorResponse from '~/utils/errorResponse';
import successResponse from '~/utils/successResponse';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const collections = await readBody(event);

	try {
		if (!collections) {
			throw createError({
				statusCode: 400,
				statusMessage: 'bad request',
				message: 'Required body',
			});
		}

		const batch = db.batch();

		collections.forEach((item: any) => {
			const ledgerRef = db.collection('collections').doc(item.uid);

			batch.delete(ledgerRef);
		});

		await batch.commit();

		return successResponse({
			message: 'Succesfully deleted collections',
		});
	} catch (error) {
		console.log(error);
		return errorResponse(error);
	}
});
