import { getFirestore } from 'firebase-admin/firestore';
import { H3Event } from 'h3';
import successResponse from '~/utils/successResponse';
import errorResponse from '~/utils/errorResponse';

export default defineEventHandler(async (event: H3Event) => {
	const uid = getRouterParam(event, 'uid');
	const { token } = await readBody<{ token: string }>(event);
	const db = getFirestore();

	if (!uid || !token) {
		throw createError({
			statusCode: 400,
			statusMessage: 'bad request',
			message: 'UID and token are required.',
		});
	}

	try {
		const residentRef = await db
			.collection('residents')
			.doc(uid)
			.update({ notificationToken: token });

		return successResponse({
			message: 'Notification token updated successfully',
			data: residentRef,
		});
	} catch (error) {
		return errorResponse(error);
	}
});
