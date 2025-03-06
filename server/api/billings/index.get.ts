import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { H3Event } from 'h3';
import calculateWaterBill from '~/utils/calculateWaterBill';
import errorResponse from '~/utils/errorResponse';

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
		const defaultTiers = [
			{ min: 0, max: 10, rate: 75, fixed: true },
			{ min: 11, max: 20, rate: 12 },
			{ min: 21, max: 30, rate: 13.5 },
			{ min: 31, max: 40, rate: 15 },
			{ min: 41, max: 50, rate: 16.5 },
			{ min: 51, max: Infinity, rate: 18 },
		];

		const selectedDate = new Date(Date.parse(month.toString()));

		if (isNaN(selectedDate.getTime())) {
			throw new Error('Invalid month format.');
		}

		const selectedYear = selectedDate.getFullYear();
		const selectedMonth = selectedDate.getMonth();

		const startOfMonth = new Date(selectedYear, selectedMonth, 1, 0, 0, 0, 0);
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
			.where(
				'createdAt',
				'<=',
				Timestamp.fromMillis(endTimestamp.toMillis() + 1),
			);

		const countSnap = await billingsQuery.count().get();

		if (q) {
			billingsQuery = billingsQuery
				.where('accountno', '>=', q)
				.where('accountno', '<=', q)
				.limit(3);
		} else {
			billingsQuery = billingsQuery.limit(10);
		}

		if (offset) {
			billingsQuery = billingsQuery.offset(Number(offset));
		}

		const billingsSnapshot = await billingsQuery.get();

		const billings = billingsSnapshot.docs.map((doc, index) => {
			const data = doc.data();
			const usage = data.averageuse || 0;

			const bill = calculateWaterBill(usage, defaultTiers);

			return {
				uid: doc.id,
				...data,
				id: index + (Number(offset) + 1),
				waterCharge: bill.waterCharge,
				environmentalFee: bill.environmentalFee,
				totalBill: bill.totalBill,
			};
		});

		return okResponse({ data: billings, total: countSnap.data().count });
	} catch (error: any) {
		console.log('billings.get', error);
		return errorResponse(error);
	}
});
