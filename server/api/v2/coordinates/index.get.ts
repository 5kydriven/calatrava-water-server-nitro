import { prisma } from '~~/prisma/client';

export default defineEventHandler(async (event) => {
	try {
		const result = await prisma.coordinate.findMany();
		return sendResponse({ event, data: result });
	} catch (error) {
		return errorResponse({ event, error });
	}
});
