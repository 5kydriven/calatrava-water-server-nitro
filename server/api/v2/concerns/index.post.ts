import { Concern } from '@prisma/client';
import { prisma } from '~~/prisma/client';

export default defineEventHandler(async (event) => {
	const concern = await readBody<Concern>(event);
	if (!concern) {
		throw createError({
			statusCode: 400,
			statusMessage: 'bad request',
			message: 'Required body',
		});
	}

	try {
		const data = await prisma.concern.create({
			data: {
				area: concern.area,
				content: concern.content,
				name: concern.name,
				status: 'pending',
				accountno: concern.accountno,
			},
		});

		// const notification = await db.collection('notifications').add({
		// 	isRead: false,
		// 	createdAt: Timestamp.now(),
		// 	name: concern.name,
		// 	uid: concern.uid,
		// 	content: concern.content,
		// });

		return sendResponse({
			event,
			message: 'Successfully created concern',
			data,
		});
	} catch (error) {
		console.log(error);
		return errorResponse({ event, error });
	}
});
