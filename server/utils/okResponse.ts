import { H3Response } from '~~/types/h3response';

export default function successResponse<T = any>({
	data,
	message = 'Success',
	total = 0,
}: Partial<H3Response<T>> = {}): H3Response<T> {
	return {
		statusCode: 200,
		statusMessage: 'ok',
		message,
		data,
		total,
	};
}
