import {
	AggregateField,
	getFirestore,
	Timestamp,
} from 'firebase-admin/firestore';
import { H3Event } from 'h3';
import successResponse from '~/utils/okResponse';
import errorResponse from '~/utils/errorResponse';

export default defineEventHandler(async (event: H3Event) => {
	try {
		const db = getFirestore();
		const now = new Date();

		// Define start and end of the month
		const startOfMonth = Timestamp.fromDate(
			new Date(now.getFullYear(), now.getMonth(), 1),
		);
		const endOfMonth = Timestamp.fromDate(
			new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
		);

		// Get resident and billing counts
		const [residentsSnap, billingsSnap] = await Promise.all([
			db.collection('residents').count().get(),
			db.collectionGroup('billings').count().get(),
		]);

		// Aggregate total income across all billings
		const totalBillingSnap = await db
			.collectionGroup('billings')
			.aggregate({ income: AggregateField.sum('totalBill') })
			.get();

		// Aggregate current month's income across all billings
		const currentMonthBillingSnap = await db
			.collectionGroup('billings')
			.where('createdAt', '>=', startOfMonth)
			.where('createdAt', '<=', endOfMonth)
			.aggregate({ income: AggregateField.sum('totalBill') })
			.get();

		// Return optimized response
		return successResponse({
			data: {
				residents: residentsSnap.data()?.count || 0,
				bills: billingsSnap.data()?.count || 0,
				totalIncome: totalBillingSnap.data()?.income || 0,
				currentMonthIncome: currentMonthBillingSnap.data()?.income || 0,
			},
		});
	} catch (error: any) {
		console.error('Firestore Aggregation Error:', error);
		return errorResponse(error);
	}
});
