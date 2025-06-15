import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
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
		const csvData = file.data.toString('utf-8');
		const data: any = parseCsvLedger(csvData);

		if (data.length < 0) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Bad Request',
				message: 'Error parsing CSV',
			});
		}

		const CHUNK_SIZE = 500;
		const chunks = [];
		for (let i = 0; i < data.length; i += CHUNK_SIZE) {
			chunks.push(data.slice(i, i + CHUNK_SIZE));
		}

		for (const chunk of chunks) {
			const { error } = await supabase.from('Ledger').insert(chunk);
			if (error) {
				console.error('Insert error:', error);
				throw createError({
					statusCode: 500,
					message: 'Failed inserting to Ledger',
					statusMessage: error.message,
				});
			}
		}

		return sendResponse({ event, message: 'Successfully uploaded ledgers' });
	} catch (error) {
		console.error(error);
		return errorResponse({ error, event });
	}
});
