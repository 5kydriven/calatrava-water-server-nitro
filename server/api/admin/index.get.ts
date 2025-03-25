import { getFirestore } from 'firebase-admin/firestore';
import { H3Event } from 'h3';

export default defineEventHandler((event: H3Event) => {
	const db = getFirestore();

	try {
	} catch (error: any) {
		return errorResponse(error);
	}
});
