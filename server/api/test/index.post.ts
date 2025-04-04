import { H3Event } from 'h3';
import { supabase } from '~/utils/supabaseClient';
import { createError } from 'h3'; // Explicitly import createError if not already

export default defineEventHandler(async (event: H3Event) => {
	try {
		// Log incoming request to debug
		console.log('Request received from Postman');

		// Read form data
		const formData = await readFormData(event);
		const file = formData.get('file') as File;
		console.log(file);

		if (!file) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Bad Request',
				message: 'Required File',
			});
		}

		const { data, error } = await supabase.storage
			.from('images')
			.upload(`payments/${file.name}`, file, {
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

		// Get public URL
		const { data: publicUrlData } = supabase.storage
			.from('images')
			.getPublicUrl(`payments/${file.name}`);

		return {
			message: 'File uploaded successfully',
			data: publicUrlData.publicUrl,
		};
	} catch (error: any) {
		console.error('Error processing request:', error);
		throw createError({
			statusCode: error.statusCode || 500,
			statusMessage: error.statusMessage || 'Internal Server Error',
			message: error.message || 'Something went wrong',
		});
	}
});
