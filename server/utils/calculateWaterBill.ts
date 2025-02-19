import { WaterRateTier } from '~~/types/WaterRateTier';

export default function calculateWaterBill(
	usage: number,
	tiers: WaterRateTier[],
) {
	let totalBill = 0;

	for (const tier of tiers) {
		if (usage <= 0) break;

		if (tier.fixed) {
			totalBill += tier.rate;
		} else {
			let cubicMeters = Math.min(usage, tier.max - tier.min + 1);
			totalBill += cubicMeters * tier.rate;
		}

		usage -= tier.max - tier.min + 1;
	}

	let environmentalFee = totalBill * 0.25;
	let totalAmount = totalBill + environmentalFee;

	return {
		waterCharge: totalBill.toFixed(2),
		environmentalFee: environmentalFee.toFixed(2),
		totalBill: totalAmount.toFixed(2),
	};
}
