import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const body = await readBody(event);
	const uid = getRouterParam(event, 'uid');
	try {
		if (!body) {
			throw createError({
				statusCode: 400,
				statusMessage: 'bad request',
				message: 'Required body',
			});
		}

		if (!uid) {
			throw createError({
				statusCode: 400,
				statusMessage: 'bad request',
				message: 'Required uid',
			});
		}

		const docRef = await db
			.collection('concerns')
			.doc(uid)
			.set(
				{
					...body,
					updatedAt: Timestamp.now(),
				},
				{ merge: true },
			);

		return successResponse({
			message: 'Successfully updated concern',
			data: docRef,
		});
	} catch (error: any) {
		return errorResponse(error);
	}
});
