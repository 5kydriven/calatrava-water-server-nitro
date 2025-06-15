export function sendResponse<T>({
	statusCode = 200,
	event,
	message = 'Retrieved Successfully',
	data,
	meta,
}: {
	event: any;
	statusCode?: number;
	message?: string;
	data?: T;
	meta?: ApiResponse<T>['meta'];
}) {
	setResponseStatus(event, statusCode);
	return { statusCode, message, data, meta };
}
