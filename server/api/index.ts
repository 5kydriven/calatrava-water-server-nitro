import { H3Event } from 'h3';

export default defineEventHandler((event: H3Event) => {
	// List of available API endpoints
	const apis = [
		{
			path: '/api/billings',
			methods: ['post', 'uid:delete', 'get', 'uid:get', 'delete'],
		},
		{
			path: '/api/residents',
			methods: ['get', 'uid:get', 'post'],
		},
		{ path: '/api/residents/notification', methods: ['uid:put'] },
		{ path: '/api/analytics/total', methods: ['get'] },
		{ path: '/api/auth', methods: ['uid:get'] },
		{ path: '/api/ledger', methods: ['get, post', 'delete', 'uid:delete'] },
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
