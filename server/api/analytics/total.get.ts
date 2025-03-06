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

		// Get start and end timestamps for the current month
		const now = new Date();
		const startOfMonth = Timestamp.fromDate(
			new Date(now.getFullYear(), now.getMonth(), 1),
		);
		const endOfMonth = Timestamp.fromDate(
			new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
		);

		// Fetch resident and billing counts
		const residentsSnap = await db.collection('residents').count().get();
		const billingsSnap = await db.collectionGroup('billings').count().get();

		// Fetch all billings per resident, aggregating manually
		let totalIncome = 0;
		let currentMonthIncome = 0;

		const residentsSnapshot = await db.collection('residents').get();

		// Loop through each resident and fetch billings
		for (const residentDoc of residentsSnapshot.docs) {
			const billingsRef = db
				.collection('residents')
				.doc(residentDoc.id)
				.collection('billings');

			// Fetch all billings for total income
			const totalBillingSnap = await billingsRef
				.aggregate({ income: AggregateField.sum('totalBill') })
				.get();
			totalIncome += totalBillingSnap.data()?.income || 0;

			// Fetch current month's billings
			const monthlyBillingSnap = await billingsRef
				.where('createdAt', '>=', startOfMonth)
				.where('createdAt', '<=', endOfMonth)
				.aggregate({ income: AggregateField.sum('totalBill') })
				.get();

			currentMonthIncome += monthlyBillingSnap.data()?.income || 0;
		}

		return successResponse({
			data: {
				residents: residentsSnap.data().count,
				bills: billingsSnap.data().count,
				totalIncome,
				currentMonthIncome,
			},
		});
	} catch (error: any) {
		console.error('Firestore Aggregation Error:', error);
		return errorResponse(error);
	}
});
