export const authReqHeader = (jwt) => {
	return {
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
	};
};

export const authCookieHeader = (session) => {
	const { accessToken, refreshToken } = session;
	const cookieVal = `${accessToken}; ${refreshToken};`;
	return {
		headers: {
			Cookie: cookieVal,
			withCredentials: true,
		},
	};
};

// return {
// 	headers: {
// 		Authorization: `Bearer ${token}`,
// 	},
//};
