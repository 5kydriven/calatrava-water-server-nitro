import {
	AggregateField,
	getFirestore,
	Timestamp,
} from 'firebase-admin/firestore';
import { H3Event } from 'h3';
import successResponse from '~/utils/successResponse';
import errorResponse from '~/utils/errorResponse';

export default defineEventHandler(async (event: H3Event) => {
	try {
		const db = getFirestore();
		const now = new Date();

		const startOfMonth = Timestamp.fromDate(
			new Date(now.getFullYear(), now.getMonth(), 1),
		);
		const endOfMonth = Timestamp.fromDate(
			new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
		);

		const residentsSnap = await db.collection('residents').count().get();

		const totalBillingSnap = await db
			.collection('billings')
			.aggregate({ income: AggregateField.sum('billamnt') })
			.get();

		const currentMonthBillingSnap = await db
			.collection('billings')
			.where('createdAt', '>=', startOfMonth)
			.where('createdAt', '<=', endOfMonth)
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
