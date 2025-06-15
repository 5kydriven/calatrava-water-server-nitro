import { Billing, Prisma } from '@prisma/client';
import { prisma } from '~~/prisma/client';
import { supabase } from '~~/server/utils/supabase';

interface GetBillingsOptions {
	page?: number;
	limit?: number;
	query?: string;
}

export async function getBillings(options: GetBillingsOptions) {
	const { page = 1, limit = 10, query } = options;

	const where: Prisma.BillingWhereInput = {
		...(query && {
			OR: [
				{
					fullname: {
						contains: query,
						mode: 'insensitive' as Prisma.QueryMode,
					},
				},
				{
					accountno: {
						contains: query,
						mode: 'insensitive' as Prisma.QueryMode,
					},
				},
			],
		}),
	};

	const [billings, total] = await Promise.all([
		prisma.billing.findMany({
			where,
			skip: (page - 1) * limit,
			take: limit,
			orderBy: { created_at: 'desc' },
		}),
		prisma.billing.count({ where }),
	]);

	return {
		data: billings,
		meta: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
}

export async function createBilling(payload: Billing[]) {
	supabase.from('billings').insert(payload);
}
