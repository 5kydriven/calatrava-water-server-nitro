import initFirebase from '~/utils/initFirebase';

export default defineNitroPlugin((nitroApp) => {
	const config = useRuntimeConfig();
	const firebaseConfig = {
		type: 'service_account',
		project_id: config.projectId,
		private_key_id: config.privateKeyId,
		private_key: config.privateKey.replace(/\\n/g, '\n'),
		client_email: config.clientEmail,
		client_id: config.clientId,
		auth_uri: config.authUri,
		token_uri: config.tokenUri,
		auth_provider_x509_cert_url: config.authProviderX509CertUrl,
		client_x509_cert_url: config.clientX509CertUrl,
		universe_domain: config.universeDomain,
	};
	
	initFirebase(firebaseConfig);
});
