import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { H3Event } from 'h3';
import pkg from 'papaparse';
const { parse } = pkg;
import errorResponse from '~/utils/errorResponse';
import successResponse from '~/utils/successResponse';
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
			return { status: 'error', message: 'No file uploaded' };
		}

		const file = formData.find((item) => item.name === 'file');
		if (!file?.data || !file.filename?.endsWith('.csv')) {
			return { status: 'error', message: 'Invalid file' };
		}

		const csvData = file.data.toString('utf-8');
		const { data, errors } = parse<ResidentData>(csvData, {
			header: true,
			skipEmptyLines: true,
		});

		if (errors.length > 0) {
			console.error('CSV Parsing Errors:', errors);
			return { status: 'error', message: 'Error parsing CSV' };
		}

		if (!data.length) {
			return { status: 'error', message: 'Empty CSV file' };
		}

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
					NotificationToken: null,
					searchKeywords: generateSearchKeywords(fullname.toLowerCase()),
				};

				batch.set(residentRef, residentData, { merge: true });

				const billingsRef = db.collection('billings');
				const subBillingRef = residentRef.collection('billings').doc();

				const billingPayload = {
					...billingData,
					book: book.toLowerCase(),
					fullname: fullname.toLowerCase(),
					billamnt: Number(billamnt),
					accountno,
					waterusage,
					paymentReceipt: null,
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

		return successResponse({
			message: 'Successfully added collections',
		});
	} catch (error) {
		console.error('Processing error:', error);
		return errorResponse(error);
	}
});
