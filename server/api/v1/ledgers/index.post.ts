import { getFirestore, Timestamp, WriteBatch } from 'firebase-admin/firestore';
import { H3Event, readMultipartFormData } from 'h3';
import generateSearchKeywords from '~/utils/searchKeyword';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const formData = await readMultipartFormData(event);

	if (!formData) {
		throw createError({
			status: 400,
			message: 'No file uploaded',
			statusMessage: 'Bad Request',
		});
	}

	const file = formData.find((item) => item.name === 'file');
	if (!file || !file.filename) {
		throw createError({
			status: 400,
			message: 'Invalid file',
			statusMessage: 'Bad Request',
		});
	}

	try {
		// Convert buffer to string
		const csvData = file.data.toString('utf-8');

		// Parse CSV into JSON
		const data = parseCsvLedger(csvData);

		console.log(`Parsed ${data.length} records.`);

		// Batch Firestore Writes (limit: 500 writes per batch)
		let batch = db.batch();
		let operationCounter = 0;
		const batches: WriteBatch[] = [];

		for (const item of data) {
			const docRef = db.collection('ledgers').doc();
			batch.set(docRef, {
				...item,
				searchKeywords: generateSearchKeywords(item.accountno),
				createdAt: Timestamp.now(),
			});
			operationCounter++;

			if (operationCounter >= 450) {
				// safer to commit around 450
				batches.push(batch);
				batch = db.batch();
				operationCounter = 0;
			}
		}

		// Push remaining
		if (operationCounter > 0) {
			batches.push(batch);
		}

		console.log(`Committing ${batches.length} batches...`);

		// Commit all batches in parallel
		const results = await Promise.allSettled(batches.map((b) => b.commit()));

		// Check for errors
		const failedBatches = results.filter((r) => r.status === 'rejected');
		if (failedBatches.length > 0) {
			console.error(`Failed ${failedBatches.length} batches`);
			throw new Error('Some batches failed to commit.');
		}

		console.log('All batches committed successfully.');
		return successResponse({ message: 'Successfully added ledger' });
	} catch (error) {
		console.error(error);
		return errorResponse({ error, event });
	}
});
