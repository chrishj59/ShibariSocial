import axios from 'axios';
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
const options = {
	// https://next-auth.js.org/configuration/providers
	providers: [
		Providers.Email({
			server: process.env.EMAIL_SERVER,
			from: process.env.EMAIL_FROM,
		}),
		Providers.Apple({
			clientId: process.env.APPLE_ID,
			clientSecret: {
				appleId: process.env.APPLE_ID,
				teamId: process.env.APPLE_TEAM_ID,
				privateKey: process.env.APPLE_PRIVATE_KEY,
				keyId: process.env.APPLE_KEY_ID,
			},
		}),
		Providers.Auth0({
			clientId: process.env.AUTH0_ID,
			clientSecret: process.env.AUTH0_SECRET,
			domain: process.env.AUTH0_DOMAIN,
		}),
		Providers.Facebook({
			clientId: process.env.FACEBOOK_ID,
			clientSecret: process.env.FACEBOOK_SECRET,
		}),
		Providers.GitHub({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
		}),
		Providers.Google({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
		}),
		Providers.Twitter({
			clientId: process.env.TWITTER_ID,
			clientSecret: process.env.TWITTER_SECRET,
		}),
		Providers.Credentials({
			// The name to display on the sign in form (e.g. 'Sign in with...')
			name: 'Credentials',
			// The credentials is used to generate a suitable form on the sign in page.
			// You can specify whatever fields you are expecting to be submitted.
			// e.g. domain, username, password, 2FA token, etc.
			credentials: {
				username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials, req) {
				return new Promise(async (resolve, reject) => {
					const { loginName, password } = credentials;
					console.log('authorize');
					console.log(credentials);
					const url = 'http://localhost:3010/api/v1' + '/auth/signin';
					try {
						const resp = await axios.post(url, {
							loginName,
							password,
						});
						console.log('axios response');
						console.log(resp.data);
						if (resp.data.statusCode === 400) {
							console.log('Get user error');
							console.log(resp.data);
							reject(new Error('Credentials supplied are incorrect.'));
						}
						const authArr = resp.headers['set-cookie'][0].split('=');
						const apiToken = { [authArr[0]]: authArr[1] };
						const tokens = resp.headers['set-cookie'];
						const { id, loginName: userName, role } = resp.data;
						const user = {
							userName,
							id,
							//apiRefreshToken: currentHashedRefreshToken,
							//apiToken,
							accessToken: tokens[0],
							refreshToken: tokens[1],
							role,
						};
						console.log('authorise returns');
						console.log(user);
						resolve(user);
						// return {
						// 	username: name,
						// 	apiRefreshToken: currentHashedRefreshToken,
						// 	apiToken,
						// };
					} catch (err) {
						console.log('axios call error');
						console.log(err);
						reject(new Error('Credentials supplied are incorrect.'));
						//return null;
					}
				});
			},
		}),
	],
	// Database optional. MySQL, Maria DB, Postgres and MongoDB are supported.
	// https://next-auth.js.org/configuration/database
	//
	// Notes:
	// * You must to install an appropriate node_module for your database
	// * The Email provider requires a database (OAuth providers do not)
	database: process.env.DATABASE_URL,

	// The secret should be set to a reasonably long random string.
	// It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
	// a seperate secret is defined explicitly for encrypting the JWT.
	secret: process.env.NEXTAUTH_SECRET,

	session: {
		// Use JSON Web Tokens for session instead of database sessions.
		// This option can be used with or without a database for users/accounts.
		// Note: `jwt` is automatically set to `true` if no database is specified.
		jwt: true,

		// Seconds - How long until an idle session expires and is no longer valid.
		// maxAge: 30 * 24 * 60 * 60, // 30 days

		// Seconds - Throttle how frequently to write to database to extend a session.
		// Use it to limit write operations. Set to 0 to always update the database.
		// Note: This option is ignored if using JSON Web Tokens
		// updateAge: 24 * 60 * 60, // 24 hours
	},

	// JSON Web tokens are only used for sessions if the `jwt: true` session
	// option is set - or by default if no database is specified.
	// https://next-auth.js.org/configuration/options#jwt
	jwt: {
		//signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
		// A secret to use for key generation (you should set this explicitly)
		secret: process.env.NEXTAUTH_SECRET, //'INp8IvdIyeMcoGAgFGoA61DdBglwwSqnXJZkgz8PSnw',
		// Set to true to use encryption (default: false)
		encryption: true,
		// You can define your own encode/decode functions for signing and encryption
		// if you want to override the default behaviour.
		// encode: async ({ secret, token, maxAge }) => {},
		// decode: async ({ secret, token, maxAge }) => {},
	},

	// You can define custom pages to override the built-in pages.
	// The routes shown here are the default URLs that will be used when a custom
	// pages is not specified for that route.
	// https://next-auth.js.org/configuration/pages
	pages: {
		signIn: '/auth/signin', // Displays signin buttons
		signOut: '/auth/signout', // Displays form with sign out button
		error: '/auth/signin', // Error code passed in query string as ?error=
		// verifyRequest: '/api/auth/verify-request', // Used for check email page
		// newUser: null // If set, new users will be directed here on first sign in
	},

	// Callbacks are asynchronous functions you can use to control what happens
	// when an action is performed.
	// https://next-auth.js.org/configuration/callbacks
	callbacks: {
		// signIn: async (user, account, profile) => {
		// 	return Promise.resolve(true);
		// },
		// redirect: async (url, baseUrl) => { return Promise.resolve(baseUrl) },
		session: async (session, user) => {
			session.accessToken = user.accessToken;
			session.refreshToken = user.refreshToken;
			session.user = user;
			return { ...session, user };
		},
		jwt: async (token, user, account, profile, isNewUser) => {
			const isSignIn = user ? true : false;
			if (isSignIn) {
				token.username = user.userName;
				token.id = user.id;
				token.accessToken = user.accessToken;
				token.refreshToken = user.refreshToken;
				token.role = user.role;
			}
			// Return previous token if the access token has not expired yet
			//if (Date.now() < token.accessTokenExpires) {
			//  return token;
			// }

			// Access token has expired, try to update it
			// return refreshAccessToken(token);
			return token;
		},
	},

	// Events are useful for logging
	// https://next-auth.js.org/configuration/events
	events: {},

	// Enable debug messages in the console if you are having problems
	debug: false,
};

export default (req, res) => NextAuth(req, res, options);
