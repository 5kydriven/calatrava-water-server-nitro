export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, 'id');
	try {
		return sendResponse({ event, message: '' });
	} catch (error) {
		console.log(error);
		return errorResponse({ event, error });
	}
});
