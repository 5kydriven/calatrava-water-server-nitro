import { getFirestore } from 'firebase-admin/firestore';

export default async function validateAccount(payload: number) {
	const db = getFirestore();

	const residentDoc = await db
		.collection('residents')
		.where('accountNumber', '==', payload)
		.get();

	return !residentDoc.empty;
}
