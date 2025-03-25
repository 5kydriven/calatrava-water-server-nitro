import {
	AggregateField,
	getFirestore,
	Timestamp,
} from 'firebase-admin/firestore';
import { H3Event } from 'h3';
import successResponse from '~/utils/successResponse';
import errorResponse from '~/utils/errorResponse';
import { format } from 'date-fns';

export default defineEventHandler(async (event: H3Event) => {
	try {
		const db = getFirestore();
		const currentMonth = format(new Date(), 'yyyy-M');

		const [year, monthNum] = currentMonth.split('-');
		const paddedMonth = monthNum.padStart(2, '0');

		const startDate = `${paddedMonth}/01/${year}`;
		const lastDay = new Date(Number(year), Number(monthNum), 0).getDate();
		const endDate = `${paddedMonth}/${lastDay}/${year}`;

		const residentsSnap = await db.collection('residents').count().get();

		const totalBillingSnap = await db
			.collection('billings')
			.aggregate({ income: AggregateField.sum('billamnt') })
			.get();

		const currentMonthBillingSnap = await db
			.collection('billings')
			.where('bill_date', '>=', startDate)
			.where('bill_date', '<=', endDate)
			.aggregate({ income: AggregateField.sum('billamnt') })
			.get();

		return successResponse({
			data: {
				residents: residentsSnap.data()?.count || 0,
				totalIncome: totalBillingSnap.data()?.income || 0,
				currentMonthIncome: currentMonthBillingSnap.data()?.income || 0,
			},
		});
	} catch (error: any) {
		console.error('Firestore Aggregation Error:', error);
		return errorResponse(error);
	}
});
