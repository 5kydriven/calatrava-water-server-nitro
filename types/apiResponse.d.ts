declare interface ApiResponse<T> {
	success?: boolean;
	message?: string;
	statusCode: number;
	event: any;
	data?: T;
	meta?: {
		page?: number;
		pageSize?: number;
		total?: number;
		totalPages?: number;
		limit?: number;
	};
	errors?: any;
}
