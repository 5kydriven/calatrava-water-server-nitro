import { getFirestore } from 'firebase-admin/firestore';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const { q, month, offset = 0 } = getQuery(event);
	try {
		let ledgerQuery = db
			.collection('ledgers')
			.orderBy('trans_date', 'asc')
			.orderBy('sequence', 'desc');

		if (month) {
			const [year, monthNum] = (month as string).split('-'); // Split "2025-3" into ["2025", "3"]
			const paddedMonth = monthNum.padStart(2, '0'); // Ensure "3" becomes "03"

			// Calculate start and end dates in MM/DD/YYYY format
			const startDate = `${paddedMonth}/01/${year}`; // e.g., "03/01/2025"
			const lastDay = new Date(Number(year), Number(monthNum), 0).getDate(); // Get last day of the month
			const endDate = `${paddedMonth}/${lastDay}/${year}`; // e.g., "03/31/2025"

			// Add date range filter (assuming 'date' is the field in your DB storing "MM/DD/YYYY")
			ledgerQuery = ledgerQuery
				// Ensure ordered by date field
				.where('trans_date', '>=', startDate)
				.where('trans_date', '<=', endDate);
		}

		const countSnap = await ledgerQuery.count().get();

		if (q) {
			ledgerQuery = ledgerQuery
				.where('accountno', '>=', q)
				.where('accountno', '<=', q)
				.limit(3);
		} else {
			ledgerQuery = ledgerQuery.limit(10);
		}

		if (offset) {
			ledgerQuery = ledgerQuery.offset(Number(offset));
		}

		const ledgerSnapshot = await ledgerQuery.get();

		const ledgers = ledgerSnapshot.docs.map((doc, index) => ({
			uid: doc.id,
			...doc.data(),
			id: index + (Number(offset) + 1),
		}));

		return successResponse({ data: ledgers, total: countSnap.data().count });
	} catch (error) {
		console.log(error);
		return errorResponse(error);
	}
});
