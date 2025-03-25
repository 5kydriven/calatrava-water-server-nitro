import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	const body = await readBody(event);
	const auth = getAuth();

	try {
		if (!body) {
			throw createError({
				statusCode: 400,
				statusMessage: 'badd request',
				message: 'Required body',
			});
		}

		const userRef = await auth.updateUser(body.uid, {
			...body,
		});

		return successResponse({
			message: 'Successfully updated account!',
			data: userRef,
		});
	} catch (error: any) {
		return errorResponse(error);
	}
});
