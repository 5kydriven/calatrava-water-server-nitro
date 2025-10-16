//https://nitro.unjs.io/config
export default defineNitroConfig({
	srcDir: 'server',
	compatibilityDate: '2025-01-28',
	runtimeConfig: {
		type: process.env.NITRO_TYPE,
		projectId: process.env.NITRO_PROJECT_ID,
		privateKeyId: process.env.NITRO_PRIVATE_KEY_ID,
		privateKey: process.env.NITRO_PRIVATE_KEY,
		clientEmail: process.env.NITRO_CLIENT_EMAIL,
		clientId: process.env.NITRO_CLIENT_ID,
		authUri: process.env.NITRO_AUTH_URI,
		tokenUri: process.env.NITRO_TOKEN_URI,
		authProviderX509CertUrl: process.env.NITRO_AUTH_PROVIDER_X509_CERT_URL,
		clientX509CertUrl: process.env.NITRO_CLIENT_X509_CERT_URL,
		universeDomain: process.env.NITRO_UNIVERSE_DOMAIN,
		supabaseUrl: process.env.NITRO_SUPABASE_URL,
		supabaseKey: process.env.NITRO_SUPABASE_KEY,
	},
	// routeRules: {
	// 	'/api/**': {
	// 		cors: true,
	// 		headers: {
	// 			'Access-Control-Allow-Origin': '*',
	// 			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
	// 			'Access-Control-Allow-Headers': 'Content-Type, Authorization',
	// 		},
	// 	},
	// },
});
