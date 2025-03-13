import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { H3Event } from 'h3';
import calculateWaterCost from '~/utils/calculateWaterCost';
import errorResponse from '~/utils/errorResponse';
import successResponse from '~/utils/successResponse';
import generateSearchKeywords from '~/utils/searchKeyword';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const body = await readBody(event);

	if (!body) {
		return errorResponse({
			statusCode: 204,
			statusMessage: 'no content',
			message: 'Request cannot be empty',
		});
	}

	if (Array.isArray(body) && body.length === 0) {
		return errorResponse({
			statusCode: 400,
			statusMessage: 'bad request',
			message: 'Request body array cannot be empty.',
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

		const dataArray = Array.isArray(body) ? body : [body];

		const batch = db.batch();
		const residentsRef = db.collection('residents');
		const billingsRef = db.collection('billings');

		const billingIds: { uid: string; accountno: string }[] = [];

		for (const item of dataArray) {
			const { address, fullname, accountno, averageuse, ...billingData } = item;

			const residentRef = residentsRef.doc(accountno);
			batch.set(
				residentRef,
				{
					address: address.toLowerCase(),
					fullname: fullname.toLowerCase(),
					createdAt: Timestamp.now(),
					classification: 'residential',
					NotificationToken: null,
					searchKeywords: generateSearchKeywords(fullname.toLowerCase()),
				},
				{ merge: true },
			);

			const subBillingRef = residentRef.collection('billings').doc();
			billingIds.push({ uid: subBillingRef.id, accountno });

			const bill = calculateWaterBill(averageuse, defaultTiers);

			const billingPayload = {
				...billingData,
				address: address.toLowerCase(),
				fullname: fullname.toLowerCase(),
				accountno,
				averageuse,
				waterCharge: calculateWaterCost(averageuse),
				totalBill: calculateWaterCost(averageuse),
				environmentalFee: bill.environmentalFee,
				paymentReceipt: null,
				status: 'unpaid',
				createdAt: Timestamp.now(),
			};

			batch.set(subBillingRef, billingPayload);

			const topLevelBillingRef = billingsRef.doc(subBillingRef.id);
			batch.set(topLevelBillingRef, {
				...billingPayload,
				residentId: accountno,
			});
		}

		await batch.commit();

		return successResponse({
			message: 'Billings uploaded successfully',
			data: billingIds,
			total: billingIds.length,
		});
	} catch (error: any) {
		console.log(error);
		return errorResponse(error);
	}
});
