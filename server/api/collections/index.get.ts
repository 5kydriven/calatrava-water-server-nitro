import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const { q, month, active, offset = 0 } = getQuery(event);

	if (!month) {
		throw createError({
			statusCode: 404,
			statusMessage: 'bad request',
			message: 'Month is required',
		});
	}
	try {
		let collectionsQuery = db
			.collection('collections')
			.orderBy('createdAt', 'asc');

		if (month) {
			const [year, monthNum] = (month as string).split('-'); // Split "2025-3" into ["2025", "3"]
			const paddedMonth = monthNum.padStart(2, '0'); // Ensure "3" becomes "03"

			// Calculate start and end dates in MM/DD/YYYY format
			const startDate = `${paddedMonth}/01/${year}`; // e.g., "03/01/2025"
			const lastDay = new Date(Number(year), Number(monthNum), 0).getDate(); // Get last day of the month
			const endDate = `${paddedMonth}/${lastDay}/${year}`; // e.g., "03/31/2025"

			// Add date range filter (assuming 'date' is the field in your DB storing "MM/DD/YYYY")
			collectionsQuery = collectionsQuery
				// Ensure ordered by date field
				.where('pymtdate', '>=', startDate)
				.where('pymtdate', '<=', endDate);
		}

		const countSnap = await collectionsQuery.count().get();

		if (q) {
			collectionsQuery = collectionsQuery
				.where('searchKeywords', 'array-contains', q)
				.limit(3);
		} else {
			collectionsQuery = collectionsQuery.limit(10);
		}

		if (offset) {
			collectionsQuery = collectionsQuery.offset(Number(offset));
		}

		const collectionsSnap = await collectionsQuery.get();

		const collections = collectionsSnap.docs.map((doc, index) => ({
			uid: doc.id,
			...doc.data(),
			id: index + (Number(offset) + 1),
		}));

		return successResponse({
			data: collections,
			total: countSnap.data().count,
		});
	} catch (error: any) {
		console.log('collections.get', error);
		return errorResponse(error);
	}
});
