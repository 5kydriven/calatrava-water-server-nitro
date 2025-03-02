import { H3Event } from 'h3';

export default defineEventHandler((event: H3Event) => {
	try {
	} catch (error: any) {
		return errorResponse(error);
	}
});
