import { H3Event } from 'h3';

function convertToDate(dateStr: string): Date {
	const [month, day, year] = dateStr.split('/').map(Number);
	return new Date(year, month - 1, day);
}

export default defineEventHandler(async (event: H3Event) => {
	const formData = await readMultipartFormData(event);
	if (!formData)
		throw createError({
			statusCode: 400,
			statusMessage: 'Bad Request',
			message: 'No file uploaded',
		});

	const file = formData.find((item) => item.name === 'file');
	if (!file || !file.filename)
		throw createError({
			statusCode: 400,
			statusMessage: 'Bad Request',
			message: 'Invalid file',
		});

	try {
		const csvData = file.data.toString('utf-8');
		const data: any = parseCsvCollection(csvData);

		if (!data.length) {
			throw createError({
				statusCode: 500,
				statusMessage: 'Internal Server Error',
				message: 'CSV parsing failed',
			});
		}

		// Get all unique account numbers
		const accountNos = [...new Set(data.map((d) => d.accountno))];

		// Preload all related billing records
		const { data: allBillings, error: billingFetchError } = await supabase
			.from('Billing')
			.select('id, bill_date, accountno')
			.in('accountno', accountNos);

		if (billingFetchError) throw billingFetchError;

		const collectionInserts: any[] = [];
		const billingIdsToUpdate: Set<string> = new Set();

		for (const item of data) {
			const [pymtMonth, pymtDay, pymtYear] = item.pymtdate
				.split('/')
				.map(Number);
			const startOfMonth = new Date(pymtYear, pymtMonth - 1, 1);
			const startOfNextMonth = new Date(pymtYear, pymtMonth, 1);

			const matched = allBillings?.filter((b) => {
				if (b.accountno !== item.accountno) return false;
				const billDate = convertToDate(b.bill_date);
				return billDate >= startOfMonth && billDate < startOfNextMonth;
			});

			if (matched?.length) {
				matched.forEach((b) => billingIdsToUpdate.add(b.id));
			}

			collectionInserts.push(item);
		}

		// Batch update billing
		if (billingIdsToUpdate.size) {
			const ids = Array.from(billingIdsToUpdate);
			const BATCH_SIZE = 1000;

			for (let i = 0; i < ids.length; i += BATCH_SIZE) {
				const chunk = ids.slice(i, i + BATCH_SIZE);
				const { error: updateError } = await supabase
					.from('Billing')
					.update({ paymentStatus: 'paid' })
					.in('id', chunk);
				if (updateError) throw updateError;
			}
		}

		// Batch insert collection
		const CHUNK_SIZE = 1000;
		for (let i = 0; i < collectionInserts.length; i += CHUNK_SIZE) {
			const chunk = collectionInserts.slice(i, i + CHUNK_SIZE);
			const { error: insertError } = await supabase
				.from('Collection')
				.insert(chunk);
			if (insertError) throw insertError;
		}

		return sendResponse({ event, message: 'Successfully added collections' });
	} catch (error) {
		console.error('Error during CSV processing:', error);
		return errorResponse({ error, event });
	}
});
