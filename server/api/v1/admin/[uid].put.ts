import { getAuth, UserRecord } from 'firebase-admin/auth';
import { H3Event } from 'h3';

interface Admin {
	displayName?: string;
	email?: string;
	password?: string;
	photoURL?: string;
	phoneNumber?: string;
}

export default defineEventHandler(async (event: H3Event) => {
	const body = await readBody<Admin>(event);
	const auth = getAuth();
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
				statusMessage: 'badd request',
				message: 'Required body',
			});
		}

		let userRef: UserRecord;

		if (body.password) {
			userRef = await auth.updateUser(uid, {
				displayName: body.displayName,
				email: body.email,
				password: body.password,
			});
		} else {
			userRef = await auth.updateUser(uid, {
				displayName: body.displayName,
				email: body.email,
			});
		}

		return successResponse({
			message: 'Successfully updated account!',
			data: userRef,
		});
	} catch (error: any) {
		return errorResponse({ error, event });
	}
});
