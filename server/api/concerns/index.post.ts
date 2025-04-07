import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const concern = await readBody(event);
	try {
		const snapshot = await db
			.collection('concerns')
			.add({ ...concern, createdAt: Timestamp.now() });

		const notification = await db.collection('notifications').add({
			isRead: false,
			createdAt: Timestamp.now(),
			name: concern.name,
			uid: concern.uid,
			content: concern.content,
		});

		return successResponse({
			data: [snapshot, notification],
			message: 'Successfully sended concern',
		});
	} catch (error: any) {
		return errorResponse(error);
	}
});
