import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { H3Event, readMultipartFormData } from 'h3';
import pkg from 'papaparse';
const { parse } = pkg;

export default defineEventHandler(async (event: H3Event) => {
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

		const test = data.map((item: any) => ({ ...item }));
		for (let i = 0; i < totalBatches; i++) {
			const batch = db.batch();
			const chunk = data.slice(i * batchSize, (i + 1) * batchSize);

			chunk.forEach((item: any) => {
				const docRef = db.collection('collections').doc();
				batch.set(docRef, { ...item, createdAt: Timestamp.now() });
			});

			await batch.commit();
			console.log(`Batch ${i + 1} committed`);
		}

		return successResponse({ message: 'Successfully added collections' });
	} catch (error) {
		console.log(error);
		return errorResponse(error);
	}
});
