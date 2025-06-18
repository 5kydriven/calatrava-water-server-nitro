import { prisma } from '~~/prisma/client';

export default defineEventHandler(async (event) => {
	try {
		const residents = await prisma.resident.findMany({
			select: { book: true },
		});

		const books = Array.from(new Set(residents.map((r) => r.book)))
			.filter(Boolean)
			.sort((a, b) => a.localeCompare(b));
		return sendResponse({ event, data: books });
	} catch (error) {
		console.log(error);
		return errorResponse({ event, error });
	}
});
