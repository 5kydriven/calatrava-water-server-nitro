import { parse } from 'csv-parse/sync';

export function parseCsvBilling(csvData: string) {
	const records = parse(csvData, {
		columns: true,
		skip_empty_lines: true,
		trim: true,
	});

	return records;
}
