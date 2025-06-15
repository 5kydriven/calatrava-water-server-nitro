import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { H3Event, readMultipartFormData } from 'h3';
import generateSearchKeywords from '~/utils/searchKeyword';

export default defineEventHandler(async (event: H3Event) => {
	const MAX_BATCH_OPERATIONS = 450;
	const db = getFirestore();
	const formData = await readMultipartFormData(event);
	if (!formData) {
		return { status: 'error', message: 'No file uploaded' };
	}

	const file = formData.find((item) => item.name === 'file');
	if (!file || !file.filename) {
		return { status: 'error', message: 'Invalid file' };
	}

	try {
		// Convert buffer to string
		const csvData = file.data.toString('utf-8');

		// Parse CSV into JSON
		const data = parseCsvCollection(csvData);

		// Batch Firestore Writes (limit: 500 per batch)
		const chunkSize = Math.floor(MAX_BATCH_OPERATIONS / 3); // since you do 2 updates + 1 set
		const totalBatches = Math.ceil(data.length / chunkSize);

		console.log(
			`Processing ${data.length} records in ${totalBatches} batches.`,
		);

		for (let i = 0; i < totalBatches; i++) {
			const batch = db.batch();
			const chunk = data.slice(i * chunkSize, (i + 1) * chunkSize);

			const billingPromises = chunk.map(async (item: any) => {
				const [pymtMonth, pymtDay, pymtYear] = item.pymtdate
					.split('/')
					.map(Number);
				const startOfMonth = new Date(pymtYear, pymtMonth - 1, 1);
				const startOfNextMonth = new Date(pymtYear, pymtMonth, 1);

				const residentBillingRef = db
					.collection('residents')
					.doc(item.accountno)
					.collection('billings');

				// Convert bill_date string to Date object for comparison
				const convertToDate = (billDate: string) => {
					const [month, day, year] = billDate.split('/').map(Number);
					return new Date(year, month - 1, day); // Return as Date object
				};

				const residentBillings = await residentBillingRef
					.get() // First, get all the billings (no query)
					.then((snapshot) => {
						return snapshot.docs.filter((doc) => {
							const billDate = doc.data().bill_date; // The string date from Firestore
							const billDateObj = convertToDate(billDate); // Convert to Date object

							return (
								billDateObj >= startOfMonth && billDateObj < startOfNextMonth // Compare as Date objects
							);
						});
					});

				residentBillings.forEach((billingDoc) => {
					const billingId = billingDoc.id;
					const subBillingRef = billingDoc.ref;
					const globalBillingRef = db.collection('billings').doc(billingId);

					batch.set(subBillingRef, { paymentStatus: 'paid' }, { merge: true });
					batch.set(
						globalBillingRef,
						{ paymentStatus: 'paid' },
						{ merge: true },
					);
				});

				const collectionDocRef = db.collection('collections').doc();
				batch.set(collectionDocRef, {
					...item,
					searchKeywords: generateSearchKeywords(item.accountno),
					createdAt: Timestamp.now(),
				});
			});

			await Promise.allSettled(billingPromises);
			await batch.commit();
			console.log(`Batch ${i + 1} committed`);
		}

		return successResponse({ message: 'Successfully added collections' });
	} catch (error) {
		console.log(error);
		return errorResponse({ error, event });
	}
});
