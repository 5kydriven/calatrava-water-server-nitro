import { format } from 'date-fns';
import { AggregateField, getFirestore } from 'firebase-admin/firestore';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const { year } = getQuery(event);

	try {
		const year = format(new Date(), 'yyyy');
		const months = Array.from({ length: 12 }, (_, i) => i + 1); // 1 to 12
		const monthNames = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		];

		const results = await Promise.all(
			months.map(async (month, index) => {
				const paddedMonth = month.toString().padStart(2, '0');
				const startDate = `${paddedMonth}/01/${year}`;
				const lastDay = new Date(Number(year), month, 0).getDate();
				const endDate = `${paddedMonth}/${lastDay}/${year}`;

				const coll = db.collection('billings');
				const q = coll
					.where('bill_date', '>=', startDate)
					.where('bill_date', '<=', endDate);

				const sumAggregateQuery = q.aggregate({
					total: AggregateField.sum('totalBill'),
				});

				const snapshot = await sumAggregateQuery.get();
				const total = snapshot.data().total || 0;

				return { month: monthNames[index], total };
			}),
		);

		return successResponse({ data: results });
	} catch (error: any) {
		return errorResponse(error);
	}
});
