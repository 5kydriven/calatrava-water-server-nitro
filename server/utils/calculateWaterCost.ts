export default function calculateWaterCost(waterUsage: number) {
	if (waterUsage <= 10) {
		return 75;
	} else if (waterUsage <= 20) {
		return 75 + (waterUsage - 10) * 12;
	} else if (waterUsage <= 30) {
		return 75 + 10 * 12 + (waterUsage - 20) * 13.5;
	} else if (waterUsage <= 40) {
		return 75 + 10 * 12 + 10 * 13.5 + (waterUsage - 30) * 15;
	} else if (waterUsage <= 50) {
		return 75 + 10 * 12 + 10 * 13.5 + 10 * 15 + (waterUsage - 40) * 16.5;
	} else {
		return (
			75 + 10 * 12 + 10 * 13.5 + 10 * 15 + 10 * 16.5 + (waterUsage - 50) * 18
		);
	}
}
