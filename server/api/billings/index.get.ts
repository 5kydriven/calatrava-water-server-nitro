import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { H3Event } from 'h3';
import errorResponse from '~/utils/errorResponse';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const { q, month, active, offset } = getQuery(event);

	if (!month) {
		throw createError({
			statusCode: 404,
			statusMessage: 'bad request',
			message: 'Month is required',
		});
	}
	try {
		const selectedDate = new Date(month.toString());

		if (isNaN(selectedDate.getTime())) {
			throw new Error('Invalid month format.');
		}

		const selectedYear = selectedDate.getFullYear();
		const selectedMonth = selectedDate.getMonth();

		const startOfMonth = new Date(selectedYear, selectedMonth, 1);
		const endOfMonth = new Date(
			selectedYear,
			selectedMonth + 1,
			0,
			23,
			59,
			59,
			999,
		);

		const startTimestamp = Timestamp.fromDate(startOfMonth);
		const endTimestamp = Timestamp.fromDate(endOfMonth);

		let billingsQuery = db
			.collectionGroup('billings')
			.where('createdAt', '>=', startTimestamp)
			.where('createdAt', '<=', endTimestamp);

		const countSnap = await billingsQuery.count().get();

		billingsQuery = q
			? billingsQuery
					.where('accountno', '>=', q)
					.where('accountno', '<=', q)
					.limit(3)
			: billingsQuery.limit(10);

		const billingsSnapshot = await billingsQuery.get();

		const billings = billingsSnapshot.docs.map((doc) => ({
			uid: doc.id,
			...doc.data(),
		}));

		return okResponse({ data: billings, total: countSnap.data().count });
	} catch (error: any) {
		console.log('billings.get', error);
		return errorResponse(error);
	}
});
