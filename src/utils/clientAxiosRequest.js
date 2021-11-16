import axios from 'axios';
import cookie from 'js-cookie';
import { useState } from 'react';

// export const clientAxiosResponse = async (action, url, payload, session) => {
// 	const { accessToken } = session;
// 	console.log(accessToken);
// 	const accessTokenArr = accessToken.split('=');
// 	console.log(accessTokenArr);
// 	cookie.set(
// 		accessTokenArr[0],
// 		accessTokenArr[1].substring(0, accessTokenArr[1].indexOf(';'))
// 	);
// 	const api = axios.create();
// 	api.defaults.withCredentials = true;
// 	try {
// 		const { data } = await api[action](url, payload);
// 		return data;
// 	} catch (err) {
// 		throw new Error(err);
// 	}
// };

const useRequest = ({ url, method, body, session }) => {
	const [requestErrors, setErrors] = useState(null);

	const doRequest = async (props = {}) => {
		// create temp cookie

		if (props.body) {
			body = props.body;
		}

		if (props.url) {
			url = props.url;
		}

		if (props.method) {
			method = props.method;
		}
		console.log('doRequest props');
		console.log(props);
		const { accessToken } = session;
		const accessTokenArr = accessToken.split('=');
		cookie.set(
			accessTokenArr[0],
			accessTokenArr[1].substring(0, accessTokenArr[1].indexOf(';'))
		);

		try {
			const api = axios.create();
			api.defaults.withCredentials = true;
			let response;
			if (method === 'GET') {
				response = await api.get(url);
			} else if (method === 'DELETE') {
				response = await api.delete(url);
			} else if (method === 'POST') {
				response = await api.post(url, { ...body, ...props });
			} else if (method === 'PUT') {
				response = await api.put(url, { ...body, ...props });
			} else if (method === 'patch') {
				response = await api.patch(url, { ...body, ...props });
			} else {
				response = await api[method](url, { ...body, ...props });
			}
			console.log('response from axios request');
			console.log(response.data);
			return response.data;
		} catch (err) {
			console.log('axios error');
			console.log(err);
			console.log(err.response);
			console.log(err.response.status);
			const { statusCode, message } = err && err.response && err.response.data;
			console.log(`statusCode: ${statusCode}  message: ${message}`);
			setErrors(`status:${statusCode} message:${message}`);

			//setErrors(err.response.data);
			console.log('errors');
			console.log(requestErrors);
		}
	};

	return { doRequest, requestErrors };
};

export default useRequest;
// usage
// const { doRequest, errors } = useRequest({
//   url: '/api/tickets',
//   method: 'post',
//   body: {
//     title,
//     price,
//   },
//   onSuccess: () => Router.push('/'),
//});
