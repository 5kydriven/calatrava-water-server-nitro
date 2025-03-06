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
		const startOfMonth = Timestamp.fromDate(
			new Date(now.getFullYear(), now.getMonth(), 1),
		);
		const endOfMonth = Timestamp.fromDate(
			new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
		);

		const residentsSnap = await db.collection('residents').count().get();
		const billingsSnap = await db.collectionGroup('billings').count().get();

		let totalIncome = 0;
		let currentMonthIncome = 0;

		const residentsSnapshot = await db.collection('residents').get();

		for (const residentDoc of residentsSnapshot.docs) {
			const billingsRef = db
				.collection('residents')
				.doc(residentDoc.id)
				.collection('billings');

			const totalBillingSnap = await billingsRef
				.aggregate({ income: AggregateField.sum('totalBill') })
				.get();
			totalIncome += totalBillingSnap.data()?.income || 0;

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
