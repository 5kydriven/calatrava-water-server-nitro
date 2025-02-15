export interface H3Response<T = any> {
	status?: number;
	message?: string;
	body?: any;
	statusCode?: StatusCode;
	statusMessage?: StatusMessage;
	data?: T;
	total?: number;
}

type StatusMessage =
	| 'ok' // 200
	| 'created' // 201
	| 'accepted' // 202
	| 'no content' // 204
	| 'bad request' // 400
	| 'unauthorized' // 401
	| 'forbidden' // 403
	| 'not found' // 404
	| 'method not allowed' // 405
	| 'conflict' // 409
	| 'unprocessable entity' // 422
	| 'internal server error' // 500
	| 'not implemented' // 501
	| 'service unavailable' // 503
	| null;

type StatusCode =
	| 200 // OK
	| 201 // Created
	| 202 // Accepted
	| 204 // No Content
	| 400 // Bad Request
	| 401 // Unauthorized
	| 403 // Forbidden
	| 404 // Not Found
	| 405 // Method Not Allowed
	| 409 // Conflict
	| 422 // Unprocessable Entity
	| 500 // Internal Server Error
	| 501 // Not Implemented
	| 503; // Service Unavailable;
