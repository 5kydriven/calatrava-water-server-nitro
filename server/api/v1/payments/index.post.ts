import { H3Event } from 'h3';
import { supabase } from '~/utils/supabase';
import { createError } from 'h3'; // Explicitly import createError if not already
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

export default defineEventHandler(async (event: H3Event) => {
	const db = getFirestore();
	const formData = await readFormData(event);
	const file = formData.get('file') as File;
	const residentUid = formData.get('uid') as string;
	const billUid = formData.get('billUid') as string;

	try {
		if (!file || !residentUid || !billUid) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Bad Request',
				message: 'Missing required fields',
			});
		}

		// Generate a unique file name using current datetime
		const timestamp = new Date().toISOString().replace(/[-:.]/g, ''); // Remove any characters that could cause issues in filenames
		const uniqueFileName = `payments/${timestamp}_${file.name}`;

		const { data, error } = await supabase.storage
			.from('images')
			.upload(uniqueFileName, file, {
				contentType: file.type,
				upsert: true,
			});

		if (error) {
			throw createError({
				statusCode: 500,
				statusMessage: 'Internal Server Error',
				message: `Failed to upload file: ${error.message}`,
			});
		}

		const { data: publicUrlData } = supabase.storage
			.from('images')
			.getPublicUrl(`payments/${file.name}`);

		const residentBill = await db
			.collection('residents')
			.doc(residentUid)
			.collection('billings')
			.doc(billUid)
			.set(
				{
					paymentReceipt: publicUrlData.publicUrl,
					paymentStatus: 'verifying',
					paymentDate: Timestamp.now(),
				},
				{ merge: true },
			);

		const billings = await db.collection('billings').doc(billUid).set(
			{
				paymentReceipt: publicUrlData.publicUrl,
				paymentStatus: 'verifying',
				paymentDate: Timestamp.now(),
			},
			{ merge: true },
		);

		const resident = await db.collection('residents').doc(residentUid).get();

		const notification = await db.collection('notifications').add({
			createdAt: Timestamp.now(),
			isRead: false,
			name: resident.data().fullname,
			uid: residentUid,
		});

		setResponseStatus(event, 200, 'OK');
		return successResponse({
			message: 'File uploaded successfully',
			data: {
				billing: billings,
				residentBill: residentBill,
				notification: notification.id,
			},
		});
	} catch (error: any) {
		console.error('Error processing request:', error);
		setResponseStatus(
			event,
			error.statusCode || 500,
			error.statusMessage || 'Internal Server Error',
		);
		return errorResponse({ error, event });
	}
});
