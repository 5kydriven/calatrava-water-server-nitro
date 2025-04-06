import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { H3Event, readMultipartFormData } from 'h3';
import pkg from 'papaparse';
import generateSearchKeywords from '~/utils/searchKeyword';
const { parse } = pkg;

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const formData = await readMultipartFormData(event);

	if (!formData) {
		createError({
			status: 400,
			message: 'No file uploaded',
			statusMessage: 'bad request',
		});
	}

	const file = formData.find((item) => item.name === 'file');
	if (!file || !file.filename) {
		createError({
			status: 400,
			message: 'Invalid file',
			statusMessage: 'bad request',
		});
	}

	try {
		// Convert buffer to string
		const csvData = file.data.toString('utf-8');

		// Parse CSV into JSON
		const { data, errors } = parse(csvData, {
			header: true,
			skipEmptyLines: true,
		});

		if (errors.length > 0) {
			console.error('CSV Parsing Errors:', errors);
			return { status: 'error', message: 'Error parsing CSV' };
		}

		// Batch Firestore Writes (limit: 500 per batch)
		const batchSize = 500;
		const totalBatches = Math.ceil(data.length / batchSize);
		console.log(
			`Processing ${data.length} records in ${totalBatches} batches.`,
		);

		for (let i = 0; i < totalBatches; i++) {
			const batch = db.batch();
			const chunk = data.slice(i * batchSize, (i + 1) * batchSize);

			chunk.forEach((item: any) => {
				const docRef = db.collection('ledgers').doc();
				batch.set(docRef, {
					...item,
					searchKeywords: generateSearchKeywords(item.accountno),
					createdAt: Timestamp.now(),
				});
			});

			await batch.commit();
			console.log(`Batch ${i + 1} committed`);
		}

		return successResponse({ message: 'Successfully added ledger' });
	} catch (error) {
		console.log(error);
		return errorResponse(error);
	}
});
