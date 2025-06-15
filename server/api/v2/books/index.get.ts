export default defineEventHandler(async (event) => {
	try {
		return sendResponse({ event, message: '' });
	} catch (error) {
		console.log(error);
		return errorResponse({ event, error });
	}
});
