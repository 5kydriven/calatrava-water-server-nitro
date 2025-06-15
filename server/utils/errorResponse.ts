import { H3Response } from '~~/types/h3response';

export default function errorResponse({
	event,
	error,
}: {
	error: Partial<H3Response>;
	event: any;
}): H3Response {
	setResponseStatus(event, error.statusCode ?? 500);
	return {
		statusCode: error.statusCode ?? 500,
		statusMessage: error.statusMessage ?? 'internal server error',
		message: error.message ?? 'An unexpected error occurred',
	};
}
