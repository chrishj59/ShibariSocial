import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Popover from '@material-ui/core/Popover';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { Alert, AlertTitle } from '@material-ui/lab';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const useStyles = makeStyles((theme) => ({
	card: {
		opacity: 0.87,
		borderRadius: 15,

		boxShadow: theme.shadows[20],
		padding: '1em',
	},
	details: {
		display: 'flex',
		direction: 'column',
	},
	inputField: {
		padding: '0.8rem',
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

export default function SignUp(props) {
	const classes = useStyles();
	const theme = useTheme();
	const router = useRouter();
	const [values, setValues] = useState({
		logonName: '',
		password: '',
		repeatPassword: '',
		showPassword: false,
		showRepeatPassword: false,
	});
	const [submitError, setSubmitError] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);

	const { errors, getValues, handleSubmit, control } = useForm();
	const pwRegex =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const handleShowPassword = (prop) => (event) => {
		console.log(prop);
		console.log(values[prop]);
		setValues({ ...values, [prop]: !values[prop] });
	};

	const onCancelBtnCick = (event) => {
		router.back();
	};
	const handleFormSubmit = async (formData, e) => {
		e.preventDefault();
		delete formData.password_confirmation;
		console.log('formData');
		console.log(formData);
		try {
			const res = await axios.post('/api/v1/auth/signup', formData);
			console.log('res from serverless function');
			console.log(res.data);
			router.push('/secure/home');
		} catch (err) {
			setSubmitError(true);
			console.log('sigup handle submit error');
		}
		//router.push('/secure/home');
	};
	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setSubmitError(false);
	};

	const handleClickPopover = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClosePopover = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;
	const bull = <span className={classes.bullet}>•</span>;
	return (
		<Grid container direction="column" justifyContent="center">
			<Grid item style={{ textAlign: 'center' }}>
				<Typography variant="h2" color="secondary" gutterBottom>
					Sign up for an account
				</Typography>
			</Grid>
			<Grid container direction="row" justifyContent="center">
				<Grid item>
					<Card className={classes.card}>
						<CardContent className={classes.details}>
							<Grid item container direction="column">
								<Grid item>
									<Typography variant="h6">Name and Password</Typography>
								</Grid>
								<form onSubmit={handleSubmit(handleFormSubmit)}>
									<Grid item className={classes.inputField}>
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
													label="Logon Name"
													fullWidth
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
									</Grid>

									<Grid item className={classes.inputField}>
										<Controller
											name="password"
											control={control}
											defaultValue=""
											rules={{
												required: {
													value: true,
													message: 'A password is required',
												},
												pattern: {
													value: pwRegex,
													message: 'Password is not strong enough',
												},
											}}
											render={({
												field: { onChange, value },
												fieldState: { error },
											}) => (
												<TextField
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
																	onMouseDown={handleMouseDownPassword}>
																	{values.showPassword ? (
																		<Visibility />
																	) : (
																		<VisibilityOff />
																	)}
																</IconButton>

																<InfoOutlinedIcon
																	onClick={handleClickPopover}
																/>
															</InputAdornment>
														),
													}}
												/>
											)}
										/>
									</Grid>

									<Grid item className={classes.inputField}>
										<Controller
											name="password_confirmation"
											control={control}
											defaultValue=""
											rules={{
												required: {
													value: true,
													message: 'Password  confirmation is required',
												},
												pattern: {
													value: pwRegex,
													message: 'Password is not strong enough',
												},
												validate: {
													matchedPreviousPassword: (value) => {
														const { password } = getValues();
														return (
															password === value ||
															'Both passwords must be the same'
														);
													},
												},
											}}
											render={({
												field: { onChange, value },
												fieldState: { error },
											}) => (
												<TextField
													variant="outlined"
													id="repeatPassword"
													type={values.showRepeatPassword ? 'text' : 'password'}
													value={value}
													label="Repeat Password"
													onChange={onChange}
													error={!!errors}
													helperText={error ? error.message : null}
													InputProps={{
														endAdornment: (
															<InputAdornment position="end">
																<IconButton
																	aria-label="toggle password confirmation visibility"
																	onClick={handleShowPassword(
																		'showRepeatPassword'
																	)}>
																	{values.showRepeatPassword ? (
																		<Visibility />
																	) : (
																		<VisibilityOff />
																	)}
																</IconButton>
																<InfoOutlinedIcon
																	onClick={handleClickPopover}
																/>
															</InputAdornment>
														),
													}}
												/>
											)}
										/>
									</Grid>
									<Grid container justifyContent="space-between">
										<Grid item>
											<Button
												className={classes.button}
												variant="contained"
												size="medium"
												color="primary"
												type="submit">
												Sign me up
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
									</Grid>
									<Grid item>
										<Snackbar
											open={submitError}
											severity="error"
											anchorOrigin={{
												vertical: 'top',
												horizontal: 'center',
											}}
											onClose={handleClose}>
											<Alert onClose={handleClose} severity="error">
												<AlertTitle>
													An error occurred creating your signin
												</AlertTitle>
												User name must be unique it its recommended to use your
												email — <strong>please correct your entry!</strong>
											</Alert>
										</Snackbar>
									</Grid>
									<Popover
										id={id}
										open={open}
										anchorEl={anchorEl}
										onClose={handleClosePopover}
										anchorOrigin={{
											vertical: 'top',
											horizontal: 'right',
										}}
										transformOrigin={{
											vertical: 'top',
											horizontal: 'left',
										}}>
										<Typography className={classes.typography}>
											<Card className={classes.card}>
												<CardHeader title="Password Requirements">
													<Typography gutterBottom variant="h5" component="h2">
														Password
													</Typography>
												</CardHeader>
												<CardContent>
													<Typography
														gutterBottom
														variant="body1"
														color="textPrimary">
														Your password must contain include.
													</Typography>

													<Typography
														gutterBottom
														variant="body1"
														color="textSecondary">
														{bull} Length must be 8 or more characters
													</Typography>
													<Typography
														gutterBottom
														variant="body1"
														color="textSecondary">
														{bull} An upper case letter
													</Typography>
													<Typography
														gutterBottom
														variant="body1"
														color="textSecondary">
														{bull} A lower case letter
													</Typography>

													<Typography
														gutterBottom
														variant="body1"
														color="textSecondary">
														{bull} A number
													</Typography>
													<Typography
														gutterBottom
														variant="body1"
														color="textSecondary">
														{bull} A special character that is one of:
														!,@,#,$,%,^,*
													</Typography>
												</CardContent>
											</Card>
										</Typography>
									</Popover>
								</form>
							</Grid>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Grid>
	);
}
