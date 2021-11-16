import { getSession, signIn } from 'next-auth/client';

export default function signin({ csrfToken }) {
	const handleSubmit = async (e) => {
		e.preventDefault();
		alert('called  handle submit');
		try {
			signIn('credentials', {
				loginName: 'tested',
				password: 'Password1!a',
			});
		} catch (err) {
			console.log('Error Submit form');
			console.log(err);
		}
	};

	return (
		<form method="post" onSubmit={(e) => handleSubmit(e)}>
			<input name="csrfToken" type="hidden" defaultValue={csrfToken} />
			<label>
				Username
				<input name="username" type="text" />
			</label>
			<label>
				Password
				<input name="password" type="password" />
			</label>
			<button type="submit">Sign in</button>
		</form>
	);
}

// This is the recommended way for Next.js 9.3 or newer
// export async function getServerSideProps(context) {
// 	return {
// 		props: {
// 			csrfToken: await getCsrfToken(context),
// 		},
// 	};
//}

signin.getInitialProps = async (context) => {
	const { req, res, query } = context;
	const session = await getSession({ req });
	console.log('init props');
	console.log(session);
	console.log(res);
	console.log(session && session.accessToken);
	if (session && res && session.user) {
		res.writeHead(302, {
			Location: '/protected',
		});
		res.end();
		return;
	}

	return {
		session: undefined,
		//providers: await providers(context),
	};
};
