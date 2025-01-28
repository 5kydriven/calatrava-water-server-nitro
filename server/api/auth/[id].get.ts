import { getAuth } from 'firebase-admin/auth';
import { H3Event } from 'h3';
import validateAccount from '~/utils/validateAccount';

export default defineEventHandler(async (event: H3Event) => {
	const param = getRouterParam(event, 'id');
	const auth = getAuth();
	try {
		const isValid = await validateAccount(param);
		if (!isValid) {
			throw createError({
				statusCode: 401,
				statusMessage: 'Unauthorized',
				message: 'Invalid account number',
			});
		}

		const token = await auth.createCustomToken(param);

		return {
			statusCode: 200,
			statusMessage: 'ok',
			message: 'Token created',
			data: token,
		};
	} catch (error: any) {
		console.log(error);
		return error;
	}
});
