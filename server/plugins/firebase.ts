import initFirebase from '~/utils/initFirebase';

export default defineNitroPlugin((nuxtapp) => {
	const config = useRuntimeConfig();
	const firebaseConfig = {
		type: 'service_account',
		project_id: 'calatrava-water-system',
		private_key_id: '6e2d8eeebc4c18cd9c7a9fef74b081972ef6ca7e',
		private_key:
			'-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCa9T++J6zXhCkA\nxbAJFDmsLHatnLvwB1lfTnk4bcEserkdT3av5sjsb6TOwqiZFJyT3igTGkCBAI+S\nMldwYQqLv79G5j69C6cfC/QhMWuctskhVk/hkafkaAb5ZK3Py9s0l/Er/G45poq/\nkZo+Kp2RsyKdFkAcQPhIbDXRq7HapYd6Gxh5djX6k6cNotLPPcaVz/eTk305gb1i\nqIGwfq653eOKpZ9D8CNpIM3zU5XPSHO5mOcsZyzJXTKJYbrc+bmnX3wfFyaq7qGq\nHx8H+WXFfcujJOswLuZVVpgzwWw7/mEh01rRErKvt3nODAQAqHEsH2a9wVVpLp1i\nViyYuOqhAgMBAAECggEABcMhWY5+DjNtNxOC2YA/FEdWKvF7/h/MgPTTtmeDbPu2\neEVDvY8Ju/FmCc/B3KkVmPyPADCELfU3Ft7zHYaoRscsuK6Cw6gkJkKyfiJUCntJ\nalP8YLVC7rq3vqynIiXmIFQBnSrUBPthJ7ZFVnLifOASJTtbdd7XH2dRuYV8AGxu\nSGWCtaTqXP/R84HBfSh4Zx8BmQjvI7pO6dUhXEqZ9fqAeiWeJIJ0vkqvvZruKlAM\nPpUP6+CEYAWhdUDtjoDTFDko5P3s6qmhacCqxV1ovSoOLQ0cL8BQUPWTc17Je2pr\nzSGITrD5DWgmJiJdj0zHzDukZsFs8fbTNUFX8GnkCQKBgQDRRuSh3iCBu4ythamW\n3Yx1F0xl+s/WMBgS9ArOVcWGeBQ6wlDIWDHKNf1LwW/VWBFN8hih/TKUeDpAsXSA\nHZ66QuMNdOBrFSC4oSssCb03dz68jsJOIQPt1YGLmLt0i616jRNsLjiWUIc+a8yC\nwnJ4o8HdoHGcYpWf5bxhfCCjiQKBgQC9jcm3kMKdDaHcUOmUFhPhKRGuUEZ0f09P\nj9GjbkQFzE6gCzRoMI0RlvTq498BT2BfNB3NjYZxUJI/LGQJyll82wAV5zLMfPyd\n7TnEUsX41q2Z15c8+GztgI6WHHrb8tZhwSLAWDJRqPUPLZVzdLhLrvZ1dbmsynLA\nyc7eeouQWQKBgQCkmMaPzR3yC2mcvKjiwIONQHLVLowy4Qa+OXUaTfmaRm1avaQ9\nvqgCa6452/0yZh7OGGBpX7Rdc6YVZbzEWweRZbQgzFEJx8dBj3leHJbWvhH4yatn\nOa5Wa/uEqO6evpEF91lUV5IoH1QPs0dZfMf9vIZo4p0Yq60U4uLkJXWiSQKBgC0y\nwPWna/BdDspk9L1d4lGfJFsnQxWGQdgb2AYbRdcIF3tsEIwDf6/BChd0THmYfsdU\nuwKHi5Y7exPbNuNqv5nY8pVGcsN1zhquNUcN4azrK6vyT1q3denP7K/4jIcjyWC3\n19x7a0wzeHOtD+Te4Q8S4iux7Zs5DtHPjSdZmyvJAoGBAM0H6e+rCd3J586uGM02\nj+mwZoN80TbO+cdznJZrnmEGI8jljS7rZnPgBSzUMJl4qTg7/3lxwRhTw7BsQerU\nxITrJy10xaGH/0IneUqZa5LtS3IdtO1JJ0peh103S2UkrU/DWvVcgCDI3WzY1O5D\nH3a2FRNXHII2A/zju3OU9t4O\n-----END PRIVATE KEY-----\n',
		client_email:
			'firebase-adminsdk-tttqm@calatrava-water-system.iam.gserviceaccount.com',
		client_id: '101451260788546245959',
		auth_uri: 'https://accounts.google.com/o/oauth2/auth',
		token_uri: 'https://oauth2.googleapis.com/token',
		auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
		client_x509_cert_url:
			'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-tttqm%40calatrava-water-system.iam.gserviceaccount.com',
		universe_domain: 'googleapis.com',
	};
	initFirebase(firebaseConfig);
});
