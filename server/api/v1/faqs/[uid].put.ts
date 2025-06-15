import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const faq = await readBody(event);
	const uid = getRouterParam(event, 'uid');
	try {
		const snapshot = await db
			.collection('faqs')
			.doc(uid)
			.set({ ...faq, updatedAt: Timestamp.now() }, { merge: true });

		return successResponse({
			data: snapshot,
			message: 'Successfully updated FAQ',
		});
	} catch (error: any) {
		return errorResponse({ error, event });
	}
});
