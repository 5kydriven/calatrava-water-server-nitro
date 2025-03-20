import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const { dueDate, content, type } = await readBody(event);

	if (!dueDate || content) {
		createError({
			statusCode: 400,
			statusMessage: 'bad request',
			message: 'Required body',
		});
	}

	try {
		const announcementSnap = await db
			.collection('announcements')
			.add({ dueDate, content, type, createdAt: Timestamp.now() });

		return successResponse({
			message: 'Succesfully added announcement',
			data: { id: announcementSnap.id },
		});
	} catch (error: any) {
		return errorResponse(error);
	}
});
