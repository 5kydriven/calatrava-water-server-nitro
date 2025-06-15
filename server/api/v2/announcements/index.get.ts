import { prisma } from '~~/prisma/client';

export default defineEventHandler(async (event) => {
	const { isAll } = getQuery(event);

	try {
		const announcements = await prisma.anouncement.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			take: isAll === 'true' ? undefined : 1,
		});
		return sendResponse({ event, data: announcements });
	} catch (error) {
		console.log(error);
		return errorResponse({ event, error });
	}
});
