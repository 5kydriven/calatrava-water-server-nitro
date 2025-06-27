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
		const data: any[] = parseCsvLedger(csvData);

		if (!data || data.length === 0) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Bad Request',
				message: 'Error parsing CSV or empty data',
			});
		}

		// STEP 1: Extract unique account numbers
		const uniqueAccountNos = [
			...new Set(data.map((item) => item.accountno?.trim())),
		];

		function batchArray<T>(array: T[], size: number): T[][] {
			const batches: T[][] = [];
			for (let i = 0; i < array.length; i += size) {
				batches.push(array.slice(i, i + size));
			}
			return batches;
		}

		let existingResidents: { accountno: string }[] = [];

		if (uniqueAccountNos.length > 0) {
			const batchedAccountNos = batchArray(uniqueAccountNos, 500);

			for (const batch of batchedAccountNos) {
				const { data, error } = await supabase
					.from('Resident')
					.select('accountno')
					.in('accountno', batch);

				if (error) {
					console.error('Resident batch query error:', error); // 🐛 DEBUG
					throw createError({
						statusCode: 500,
						message: 'Failed checking residents',
						statusMessage: error.message,
					});
				}

				existingResidents.push(...(data ?? []));
			}
		}

		const existingAccountSet = new Set(
			existingResidents.map((r) => r.accountno),
		);
		const missingResidents = uniqueAccountNos.filter(
			(acc) => !existingAccountSet.has(acc),
		);

		// STEP 2: Insert placeholder residents if missing
		if (missingResidents.length > 0) {
			const placeholders = missingResidents.map((acc) => ({
				accountno: acc,
				fullname: 'Placeholder Resident',
				classtype: 'Unknown',
				book: 'Unknown',
				isPlaceholder: true,
			}));

			const { error: insertPlaceholderError } = await supabase
				.from('Resident')
				.insert(placeholders);

			if (insertPlaceholderError) {
				throw createError({
					statusCode: 500,
					message: 'Failed inserting placeholder residents',
					statusMessage: insertPlaceholderError.message,
				});
			}
		}

		// STEP 3: Insert ledgers in chunks
		const CHUNK_SIZE = 300; // reduce if large data
		for (let i = 0; i < data.length; i += CHUNK_SIZE) {
			const chunk = data.slice(i, i + CHUNK_SIZE);

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
