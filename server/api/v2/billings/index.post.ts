import { H3Event } from 'h3';
import { sendResponse } from '~/utils/response';

interface ResidentData {
	book: string;
	fullname: string;
	accountno: string;
	waterusage: string;
	billamnt: number;
	[key: string]: any;
}

export default defineEventHandler(async (event: H3Event) => {
	try {
		const formData = await readMultipartFormData(event);
		const file = formData?.find((item) => item.name === 'file');

		if (!file?.data || !file.filename?.endsWith('.csv')) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Bad Request',
				message: 'Invalid or missing file',
			});
		}

		const csvText = file.data.toString('utf-8');
		const data: ResidentData[] = parseCsvBilling(csvText);

		if (data.length < 0 || !data.length) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Bad Request',
				message: 'Error parsing csv',
			});
		}

		const residents = data
			.filter((d) => d.accountno && d.fullname && d.book)
			.map((d) => ({
				accountno: d.accountno,
				fullname: d.fullname.toLowerCase(),
				book: d.book.toLowerCase(),
				classtype: d.classtype || null,
			}));

		const { error: residentFnError } = await supabase.rpc('insert_residents', {
			resident_data: residents,
		});

		if (residentFnError) throw residentFnError;

		const CHUNK_SIZE = 1000;
		const billings = data.map((item) => {
			const envFee =
				Number(item.waterusage) > 10 ? Number(item.waterusage) * 0.25 : 0;

			return {
				accountno: item.accountno,
				fullname: item.fullname.toLowerCase(),
				book: item.book.toLowerCase(),
				classtype: item.classtype,
				arrearsenv: item.arrearsenv,
				billamnt: Number(item.billamnt),
				environmentFee: envFee,
				totalBill: Number(item.billamnt) + envFee,
				waterusage: item.waterusage,
				paymentStatus: null,
				paymentDate: null,
				paymentReceipt: null,
				due_penalty: '0',
				...item,
			};
		});

		for (let i = 0; i < billings.length; i += CHUNK_SIZE) {
			const chunk = billings.slice(i, i + CHUNK_SIZE);
			const { error: billingError } = await supabase
				.from('Billing')
				.insert(chunk);
			if (billingError) throw billingError;
		}

		return sendResponse({ event, message: 'Successfully uploaded billing' });
	} catch (err: any) {
		console.error('CSV upload error:', err);
		throw createError({
			statusCode: 500,
			statusMessage: 'Internal Server Error',
			message: (err as Error).message,
		});
	}
});
