import { Snackbar } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Slide from '@mui/material/Slide';
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Alert, AlertTitle } from '@mui/material';
import { csrfToken, getSession, providers, signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const useStyles = makeStyles((theme) => ({
	card: {
		opacity: 0.87,
		borderRadius: 15,

		boxShadow: theme.shadows[20],
		padding: '1em',
	},

	snackbar: {
		opacity: 1.0,
	},

	details: {
		display: 'flex',
		direction: 'column',
	},

	inputField: {
		marginTop: '10px',
		padding: '0.2rem',
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)',
	},
	title: {
		fontSize: 14,
	},
	pos: {
		marginBottom: 12,
	},

	button: {
		textTransform: 'none',
	},
}));
function Signin({ providers, csrfToken }) {
	const classes = useStyles();
	const theme = useTheme();
	const router = useRouter();
	const [values, setValues] = useState({
		logonName: '',
		password: '',
		showPassword: false,
	});
	const [submitError, setSubmitError] = useState(false);
	const [subErrorReason, setSubErrorReason] = useState('');

	const [anchorEl, setAnchorEl] = useState(null);

	const { errors, getValues, handleSubmit, control } = useForm();

	useEffect(() => {
		// Getting the error details from URL
		console.log(`router query ${router.query}`);
		console.log(JSON.stringify(router.query));
		console.log(`router query error ${router.query.error}`);
		if (router.query.error) {
			setSubmitError(true);
			setSubErrorReason(router.query.error);
		}
	}, [router]);
	const onCancelBtnCick = (event) => {
		router.back();
	};

	const handleShowPassword = (prop) => (event) => {
		console.log(prop);
		console.log(values[prop]);
		setValues({ ...values, [prop]: !values[prop] });
	};
	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const handleFormSubmit = async (formData, e) => {
		e.preventDefault();
		setSubmitError(false);
		console.log('handlesubmit');
		console.log(formData);
		const { name, password } = formData;
		// const url = 'http://localhost:3010/api/v1' + '/auth/signin';
		try {
			//signin();
			signIn('credentials', {
				loginName: name,
				password,
			});

			// callbackUrl: `${window.location.origin}/secure/home`,

			// const response = await axios.patch('/api/v1/auth/signin', formData);
			// console.log('from api/api/v1/auth/signin');
			// console.log('response headers');
			// console.log(response.headers);
			// const resp = await axios.post(
			// 	url,
			// 	{ loginName: name, password },
			// 	{ withCredentials: true }
			// );
			// console.log('Client headers ');
			// console.log(resp.headers);
			// router.push('/secure/home');
		} catch (err) {
			console.log(err);
			setSubmitError(true);
			setSubErrorReason('Invalid name or password');
		}
	};
	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setSubmitError(false);
	};

	const transitionRight = (props) => {
		return <Slide {...props} direction="right" />;
	};
	return (
        <Grid container direction="column" justifyContent="center">
			<Grid item style={{ textAlign: 'center' }}>
				<Typography variant="h2" gutterBottom>
					<Grid item style={{ textAlign: 'center' }}>
						<Typography variant="h2" color="secondary" gutterBottom>
							Sign into your account
						</Typography>
					</Grid>
				</Typography>
			</Grid>
			<Grid container direction="row" justifyContent="center">
				<Grid item>
					<Card className={classes.card}>
						<CardContent className={classes.details}>
							<Grid item container direction="column">
								<Grid item>
									<Typography variant="h6">Enter login details</Typography>
								</Grid>
								<form onSubmit={handleSubmit(handleFormSubmit)}>
									<Controller
										name="name"
										control={control}
										defaultValue=""
										rules={{
											required: { value: true, message: 'name is required' },
											maxLength: {
												value: 40,
												message: 'Maxiumn length is 40',
											},
											minLength: { value: 5, message: 'Minimum length is 5' },
										}}
										render={({
											field: { onChange, value },
											fieldState: { error },
										}) => (
											<TextField
												className={classes.inputField}
												label="Logon Name"
												fullWidth
												autoFocus={true}
												variant="outlined"
												value={value}
												onChange={onChange}
												error={!!error}
												helperText={error ? error.message : null}
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															<AccountCircle />
														</InputAdornment>
													),
												}}
											/>
										)}
									/>
									<Controller
										name="password"
										control={control}
										defaultValue=""
										rules={{
											required: {
												value: true,
												message: 'A password is required',
											},
										}}
										render={({
											field: { onChange, value },
											fieldState: { error },
										}) => (
											<TextField
												className={classes.inputField}
												variant="outlined"
												fullWidth
												type={values.showPassword ? 'text' : 'password'}
												label="Password"
												value={value}
												onChange={onChange}
												error={!!errors}
												helperText={error ? error.message : null}
												InputProps={{
													endAdornment: (
														<InputAdornment position="end">
															<IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleShowPassword('showPassword')}
                                                                onMouseDown={handleMouseDownPassword}
                                                                size="large">
																{values.showPassword ? (
																	<Visibility />
																) : (
																	<VisibilityOff />
																)}
															</IconButton>
														</InputAdornment>
													),
												}}
											/>
										)}
									/>
									<Grid container justifyContent="space-between">
										<Grid item>
											<Button
												className={classes.button}
												variant="contained"
												size="medium"
												color="primary"
												type="submit">
												Let me in. Yay!
											</Button>
										</Grid>
										<Grid item>
											<Button
												className={classes.button}
												variant="contained"
												size="medium"
												color="secondary"
												onClick={onCancelBtnCick}>
												Cancel
											</Button>
										</Grid>
										<Grid item>
											<Snackbar
												severity="error"
												className={classes.snackbar}
												open={submitError}
												anchorOrigin={{
													vertical: 'bottom',
													horizontal: 'center',
												}}
												onClose={handleClose}
												TransitionComponent={transitionRight}>
												<Alert onClose={handleClose} severity="error">
													<AlertTitle>
														<strong>Signin error</strong>
													</AlertTitle>
													{subErrorReason} —{' '}
													<strong>please correct your entry!</strong>
												</Alert>
											</Snackbar>
										</Grid>
									</Grid>
								</form>
							</Grid>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Grid>
    );
}

Signin.getInitialProps = async (context) => {
	const { req, res } = context;
	console.log('Signin getInitial Props called');

	const session = await getSession({ req });
	console.log('getInitial Props called');
	console.log(session);
	if (session && res && session.accessToken) {
		console.log('get Initial props');
		console.log(session);
		res.writeHead(302, {
			Location: '/secure/home',
		});
		res.end();
		return;
	}
	return {
		session: undefined,
		providers: await providers(context),
		csrfToken: await csrfToken(context), // email signin
	};
};

export default Signin;
