import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { H3Event } from 'h3';
import errorResponse from '~/utils/errorResponse';
import generateSearchKeywords from '~/utils/searchKeyword';

interface ResidentData {
	book: string;
	fullname: string;
	accountno: string;
	waterusage: string;
	billamnt: number;
	[key: string]: any;
}

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();

	try {
		const formData = await readMultipartFormData(event);
		if (!formData?.length) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Bad Request',
				message: 'No file uploaded',
			});
		}

		const file = formData.find((item) => item.name === 'file');
		console.log(file);
		if (!file?.data || !file.filename?.endsWith('.csv')) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Bad Request',
				message: 'Invalid file',
			});
		}

		const csvData = file.data.toString('utf-8');
		const data = parseCsvBilling(csvData);
		if (!data.length) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Bad Request',
				message: 'Empty CSV file',
			});
		}

		const uniqueBooks = new Set<string>();
		data.forEach((item: ResidentData) => {
			if (item.book) {
				uniqueBooks.add(item.book.toLowerCase());
			}
		});

		await db
			.collection('books')
			.doc('all_books')
			.set({
				books: Array.from(uniqueBooks),
				updatedAt: Timestamp.now(),
			});

		const BATCH_SIZE = 500;
		const batches = [];

		for (let i = 0; i < data.length; i += BATCH_SIZE) {
			const batch = db.batch();
			const chunk = data.slice(i, i + BATCH_SIZE);

			chunk.forEach((item: ResidentData) => {
				const {
					book,
					fullname,
					accountno,
					waterusage,
					arrearsenv,
					due_penalty,
					classtype,
					billamnt,
					...billingData
				} = item;

				if (!accountno || !fullname || !book) {
					return;
				}

				const residentsRef = db.collection('residents');
				const residentRef = residentsRef.doc(accountno);

				const residentData = {
					book: book.toLowerCase(),
					fullname: fullname.toLowerCase(),
					createdAt: Timestamp.now(),
					classtype,
					notificationToken: null,
					searchKeywords: generateSearchKeywords(fullname.toLowerCase()),
				};

				batch.set(residentRef, residentData, { merge: true });

				const billingsRef = db.collection('billings');
				const subBillingRef = residentRef.collection('billings').doc();
				const enviromentFee =
					Number(waterusage) > 10 ? Number(waterusage) * 0.25 : 0;

				const billingPayload = {
					...billingData,
					book: book.toLowerCase(),
					fullname: fullname.toLowerCase(),
					billamnt: Number(billamnt),
					due_penalty: '0',
					arrearsenv,
					enviromentFee,
					totalBill: Number(billamnt) + Number(enviromentFee),
					accountno,
					searchKeywords: generateSearchKeywords(accountno),
					waterusage,
					paymentReceipt: null,
					paymentStatus: null,
					paymentDate: null,
					classtype,
					createdAt: Timestamp.now(),
				};

				batch.set(subBillingRef, billingPayload);
				batch.set(billingsRef.doc(subBillingRef.id), {
					...billingPayload,
					residentId: accountno,
				});
			});

			batches.push(batch.commit());
		}

		await Promise.all(batches);

		return sendResponse({
			event,
			message: 'Successfully added billings',
		});
	} catch (error) {
		console.error('Processing error:', error);
		return errorResponse({ error, event });
	}
});
