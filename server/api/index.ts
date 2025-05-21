import { H3Event } from 'h3';

export default defineEventHandler((event: H3Event) => {
	// List of available API endpoints
	const apis = [
		{
			path: '/api/billings',
			methods: ['post', 'uid:delete', 'get', 'uid:get', 'delete', 'uid:put'],
		},
		{ path: '/api/residents', methods: ['get', 'uid:get', 'post'] },
		{ path: '/api/residents/notification', methods: ['uid:put'] },
		{ path: '/api/residents/collection', methods: ['uid:get'] },
		{ path: '/api/residents/ledger', methods: ['uid:get'] },
		{ path: '/api/analytics/total', methods: ['get'] },
		{ path: '/api/analytics/line', methods: ['get'] },
		{ path: '/api/auth', methods: ['uid:get'] },
		{ path: '/api/ledgers', methods: ['get, post', 'delete', 'uid:delete'] },
		{ path: '/api/collections', methods: ['get, post', 'delete'] },
		{ path: '/api/reminders', methods: ['uid:get, post'] },
		{ path: '/api/announcements', methods: ['get, post'] },
		{ path: '/api/admin', methods: ['uid:put'] },
		{ path: '/api/payments', methods: ['post'] },
		{ path: '/api/notifications', methods: ['put', 'get'] },
		{ path: '/api/concerns', methods: ['post', 'get', 'uid:delete'] },
		{ path: '/api/faqs', methods: ['post', 'get', 'uid:delete', 'uid:put'] },
		{
			path: '/api/coordinates',
			methods: ['post', 'get', 'uid:delete', 'uid:put', 'uid:get'],
		},
	];

	const apiList = apis
		.map(
			(api) => `
			<div style="margin-bottom: 20px;">
					<strong>${api.path}</strong>
					<ul style="margin-top: 5px;">
							${api.methods.map((method) => `<li>${method}</li>`).join('')}
					</ul>
			</div>
	`,
		)
		.join('');

	const htmlContent = `
			<!DOCTYPE html>
			<html lang="en">
			<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Calatrava Waterworks API</title>
					<style>
							body { font-family: Arial, sans-serif; padding: 20px; }
							h1 { color: #007BFF; }
							strong { font-size: 16px; color: #333; display: block; margin-bottom: 5px; }
							ul { margin-top: 5px; padding-left: 20px; }
							li { margin-bottom: 3px; }
					</style>
			</head>
			<body>
					<h1>Calatrava Waterworks API</h1>
					<p>List of available API endpoints:</p>
					${apiList}
			</body>
			</html>
	`;

	return send(event, htmlContent, 'text/html');
});
