export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	return sendResponse({
		event,
		message: '',
	});
});
