import { H3Response } from '~~/types/h3response';

export default function errorResponse(error: Partial<H3Response>): H3Response {
	return {
		statusCode: error.statusCode ?? 500,
		statusMessage: error.statusMessage ?? 'internal server error',
		message: error.message ?? 'An unexpected error occurred',
	};
}
