import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const faq = await readBody(event);
	try {
		const snapshot = await db
			.collection('faqs')
			.add({ ...faq, createdAt: Timestamp.now() });

		return successResponse({
			data: snapshot,
			message: 'Successfully created FAQ',
		});
	} catch (error: any) {
		return errorResponse(error);
	}
});
