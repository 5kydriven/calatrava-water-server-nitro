import { getFirestore } from 'firebase-admin/firestore';
import { H3Event } from 'h3';

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

		const residentRef = db.collection('residents').doc(uid);
		const residentSnapshot = await residentRef.get();
		const residentBillings = await residentRef
			.collection('billings')
			.orderBy('createdAt', 'desc')
			.get();

		const billings = residentBillings.docs.map((doc) => {
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
		return okResponse({
			data: { ...residentSnapshot.data(), billings, uid: residentSnapshot.id },
		});
	} catch (error: any) {
		return errorResponse(error);
	}
});
