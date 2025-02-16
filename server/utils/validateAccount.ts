import { getFirestore } from 'firebase-admin/firestore';

export default async function validateAccount(uid: string) {
	const db = getFirestore();

	const residentDoc = await db.collection('residents').doc(uid).get();

	return residentDoc.exists;
}
