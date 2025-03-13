import { getFirestore } from 'firebase-admin/firestore';
import { H3Event } from 'h3';
import errorResponse from '~/utils/errorResponse';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const uid = getRouterParam(event, 'uid');

	try {
		const defaultTiers = [
			{ min: 0, max: 10, rate: 75, fixed: true },
			{ min: 11, max: 20, rate: 12 },
			{ min: 21, max: 30, rate: 13.5 },
			{ min: 31, max: 40, rate: 15 },
			{ min: 41, max: 50, rate: 16.5 },
			{ min: 51, max: Infinity, rate: 18 },
		];

		const billingsRef = db
			.collection('residents')
			.doc(uid)
			.collection('billings')
			.orderBy('createdAt', 'desc');

		const countSnapshot = await billingsRef.count().get();

		const billingsSnapshot = await billingsRef.get();

		const billings = billingsSnapshot.docs.map((doc) => {
			const data = doc.data();
			const usage = data.averageuse || 0;

			const bill = calculateWaterBill(usage, defaultTiers);

			return {
				uid: doc.id,
				...data,
				waterCharge: bill.waterCharge,
				environmentalFee: bill.environmentalFee,
				totalBill: bill.totalBill,
			};
		});
		return successResponse({
			data: billings,
			total: countSnapshot.data().count,
		});
	} catch (error: any) {
		console.log('billings/[uid].get', error);
		return errorResponse(error);
	}
});
