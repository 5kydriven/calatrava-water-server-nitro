import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { H3Event } from 'h3';
import errorResponse from '~/utils/errorResponse';
import successResponse from '~/utils/okResponse';
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
		const dataArray = Array.isArray(body) ? body : [body];

		const batch = db.batch();
		const residentsRef = db.collection('residents');

		const billingIds: { uid: string; accountno: string }[] = [];

		for (const item of dataArray) {
			const { address, fullname, accountno, ...billingData } = item;

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

			const billingRef = residentRef.collection('billings').doc();
			billingIds.push({ uid: billingRef.id, accountno });

			batch.set(billingRef, {
				...billingData,
				address: address.toLowerCase(),
				fullname: fullname.toLowerCase(),
				accountno,
				paymentReceipt: null,
				status: 'unpaid',
				createdAt: Timestamp.now(),
			});
		}

		await batch.commit();

		return successResponse({
			message: 'Billings added successfully under residents.',
			data: billingIds,
			total: billingIds.length,
		});
	} catch (error: any) {
		console.log(error);
		return errorResponse(error);
	}
});
