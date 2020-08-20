import axios from 'axios';

const voteSmartEndpoint = axios.create({
	baseURL: 'http://api.votesmart.org',
});

voteSmartEndpoint.interceptors.request.use((config) => {
	config.params = {
		// add default params
		key: String(process.env.VOTE_SMART_API_KEY),
		o: 'JSON',
		// spread the request's params
		...config.params,
	};
	return config;
});

export default voteSmartEndpoint;
