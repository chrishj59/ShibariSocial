import { getSession } from 'next-auth/react';

export const redirectIfUnauthenticated = async (context) => {
	const session = await getSession(context);

	if (!session) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}
};
