import 'date-fns';

import DateFnsUtils from '@date-io/date-fns';
import { FormControl, FormLabel, Grid, MenuItem, Slide, Snackbar, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { Alert, AlertTitle } from '@mui/material';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import axios from 'axios';
import { convertToRaw } from 'draft-js';
import MUIRichTextEditor from 'mui-rte';
import { getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import NumberFormat from 'react-number-format';
import { authCookieHeader } from 'src/utils/authReqHeader';
import useRequest from 'src/utils/clientAxiosRequest';

const useStyles = makeStyles((theme) => ({
	dialogRoot: {
		margin: 0,
		padding: theme.spacing(2),
	},
	card: {
		// opacity: 0.87,
		borderRadius: 15,

		boxShadow: theme.shadows[20],
		padding: '1em',
	},
	autocomplete: {
		width: 300,
	},
	details: { display: 'flex', direction: 'column' },
	button: {
		textTransform: 'none',
	},
	snackbar: {
		opacity: 1.0,
	},
	tabRoot: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
	},
	inputField: {
		paddingRight: '0.5rem',
		marginRight: '1rem',
	},
	descriptionLabel: {
		color: theme.palette.common.orange,
		fontWeight: 800,
		fontSize: '0.875rem',
	},
	dropDownRoot: {
		'& .MuiTextField-root': {
			width: '30ch',
			paddingRight: '0.5rem',
		},
	},
	formLabel: {
		marginTop: '0.9em',
		marginRight: '0.5rem',
	},
	locationContainer: {
		flexGrow: 1,
	},
}));

const formDefaultValues = {
	descr: '',
	startsAt: new Date().setHours(18, 0, 0, 0),
	endsAt: new Date().setHours(23, 0, 0, 0),
};

const EventAdd = (props) => {
	const { counties = [], session } = props;
	const classes = useStyles();
	const theme = useTheme();
	const router = useRouter();
	const {
		errors: formErrors,
		getValues,
		setValue,
		reset,

		register,
		handleSubmit,
		watch,
		control,
	} = useForm({ defaultValues: formDefaultValues });

	useEffect(() => {
		register('descr');
		register('cost');
	}, [register]);
	const countyWatch = watch('county');
	const [cities, setCities] = useState([]);
	const [formEntry, setFormEntry] = useState({});
	const [requestError, setRequestError] = useState(false);
	const [alertTitle, setAlertTitle] = useState('');
	const [subErrorReason, setSubErrorReason] = useState('');
	let url = process.env.NEXT_PUBLIC_SH_API_BASEURL + '/activity';
	console.log(session);
	const { doRequest, requestErrors } = useRequest({
		url,
		method: 'POST',
		formEntry,
		session,
		onError: (errResp) => {
			console.log('errResp');
			console.log(errResp);
		},
	});

	const handleFormSubmit = async (formData, e) => {
		e.preventDefault();
		setRequestError(false);
		setAlertTitle('');
		setSubErrorReason('');
		if (formData.startsAt) {
			const date = new Date(formData.startsAt);
			formData.startsAt = date.toISOString();
		}
		if (formData.endsAt) {
			const date = new Date(formData.endsAt);
			formData.endsAt = date.toISOString();
		}

		//setFormEntry(formData);

		const data = await doRequest({
			url,
			method: 'POST',
			body: formData,
			session,
		});
		if (requestErrors) {
			setAlertTitle('Could not add event');

			const reasonArr = requestErrors.split(':');
			const errMsg = reasonArr[2];
			setSubErrorReason(errMsg);

			setRequestError(true);
		}
		if (data) {
			console.log('data from dorequest');
			console.log(data);
			router.push('/secure/events/fetishEvent');
		}
	};

	const handleCountyChange = async (e) => {
		setRequestError(false);
		setAlertTitle('');
		setSubErrorReason('');
		url =
			process.env.NEXT_PUBLIC_SH_API_BASEURL +
			`/place/ukPlace?county=${e.target.value}`;
		const data = await doRequest({ url, method: 'GET' });
		setCities(data);

		if (requestErrors) {
			setAlertTitle('Get cities');

			const reasonArr = requestErrors.split(':');
			const errMsg = reasonArr[2];
			setSubErrorReason(errMsg);

			setRequestError(true);
		}

		// setFolderName(event.target.value);
	};
	const handleCloseSnackbar = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setRequestError(false);
	};

	const transitionRight = (props) => {
		return <Slide {...props} direction="right" />;
	};

	const buttons = (
		<Grid container justifyContent="center">
			<Grid item>
				<Button
					className={classes.button}
					variant="contained"
					size="medium"
					color="primary"
					type="submit">
					Yea, save my details
				</Button>
			</Grid>
		</Grid>
	);

	const row3 = (
		<>
			<Grid item className={classes.inputField}>
				<Controller
					name="cost"
					control={control}
					rules={{
						required: {
							value: false,
							message: 'Cost is required',
						},
					}}
					render={({ field: { onChange, value }, fieldState: { error } }) => (
						<NumberFormat
							label="Cost"
							value={value}
							customInput={TextField}
							thousandSeparator={true}
							decimalScale={2}
							fixedDecimalScale={true}
							alignItems="right"
							helperText={error ? error.message : 'Cost of the event'}
							onValueChange={(v) => {
								//value without dollar signe
								console.log(v.value);
								setValue('cost', v.value);
							}}
						/>
					)}
				/>
			</Grid>
			<Grid item className={classes.inputField}>
				<Controller
					name="dressCode"
					control={control}
					rules={{
						required: {
							value: false,
							message: 'Dress code is required',
						},
					}}
					render={({ field: { onChange, value }, fieldState: { error } }) => (
						<TextField
							label="Dress code "
							value={value || ''}
							onChange={onChange}
							error={!!error}
							helperText={
								error ? error.message : 'Make at effort no Jeans and T shirts'
							}></TextField>
					)}
				/>
			</Grid>
		</>
	);

	const row4 = (
		<>
			<Grid item className={classes.inputField}>
				<Controller
					name="startsAt"
					control={control}
					default={new Date().setHours(18, 0, 0, 0)}
					render={({ field: { onChange, value }, fieldState: { error } }) => (
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<KeyboardDateTimePicker
								className={classes.datePicker}
								margin="normal"
								id="startAt-dialog"
								label="From"
								format="dd/MM/yyyy hh:mm a"
								value={value}
								onChange={onChange}
								KeyboardButtonProps={{
									'aria-label': 'Event start',
								}}
							/>
						</MuiPickersUtilsProvider>
					)}
				/>
			</Grid>
			<Grid item className={classes.inputField}>
				<Controller
					name="endsAt"
					control={control}
					default={new Date().setHours(23, 0, 0)}
					render={({ field: { onChange, value }, fieldState: { error } }) => (
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<KeyboardDateTimePicker
								className={classes.datePicker}
								margin="normal"
								id="endAt-dialog"
								label="Until"
								ampm={true}
								format="dd/MM/yyyy hh:mm a"
								value={value}
								onChange={onChange}
								KeyboardButtonProps={{
									'aria-label': 'Events ends at',
								}}
							/>
						</MuiPickersUtilsProvider>
					)}
				/>
			</Grid>
		</>
	);

	const errorMsgFormat = (message) => {
		if (message.indexOf === -1) {
			return message;
		}
		const msgArr = message.split(',');
		return msgArr.map((msg, idx) => {
			return <li key={idx}>{msg}</li>;
		});
	};

	const locationRow = (
		<>
			<Grid item>
				<Typography className={classes.formLabel} variant="h6">
					Location
				</Typography>
			</Grid>
			<Grid item className={classes.dropDownRoot}>
				<Controller
					name="county"
					control={control}
					render={({ field: { onChange, value }, fieldState: { error } }) => (
						<TextField
							select
							label="County"
							value={value || ''}
							onChange={(e) => {
								onChange(e), handleCountyChange(e);
							}}
							error={!!error}
							helperText={error ? error.message : null}>
							{counties &&
								counties.map((option) => {
									return (
										<MenuItem key={option.county} value={option.county}>
											{option.county}
										</MenuItem>
									);
								})}
						</TextField>
					)}
				/>
			</Grid>

			<Grid item className={classes.dropDownRoot}>
				<Controller
					name="cityId"
					control={control}
					//default=""
					render={({ field: { onChange, value }, fieldState: { error } }) => (
						<TextField
							select
							label="City"
							value={value || ''}
							disabled={!countyWatch ? true : false}
							onChange={onChange}
							error={!!error}
							helperText={error ? error.message : null}>
							{cities.map((option, idx) => {
								return (
									<MenuItem key={option.id} value={option.id}>
										{option.place}
									</MenuItem>
								);
							})}
						</TextField>
					)}
				/>
			</Grid>
		</>
	);

	return (
		<>
			<Grid container direction="column" justifyContent="center">
				<Grid item style={{ textAlign: 'center' }}>
					<Typography variant="h2" gutterBottom color="secondary">
						Your new event
					</Typography>
				</Grid>
				<Grid item>
					<Grid
						item
						container
						direction="row"
						alignItems="flex-start"
						justifyContent="center">
						<Card className={classes.card}>
							<CardContent className={classes.details}>
								<form onSubmit={handleSubmit(handleFormSubmit)}>
									<Grid container item>
										<Grid item className={classes.inputField}>
											<Controller
												name="name"
												control={control}
												rules={{
													required: {
														value: true,
														message: 'Event name is required',
													},
												}}
												render={({
													field: { onChange, value },
													fieldState: { error },
												}) => (
													<TextField
														label="Event Name"
														value={value || ''}
														onChange={onChange}
														error={!!error}
														helperText={
															error
																? error.message
																: 'Searchable name of the event'
														}></TextField>
												)}
											/>
										</Grid>
										<Grid item className={classes.inputField}>
											<Controller
												name="tagLine"
												control={control}
												rules={{
													required: {
														value: true,
														message: 'Tagline is required',
													},
												}}
												render={({
													field: { onChange, value },
													fieldState: { error },
												}) => (
													<TextField
														label="Tagline "
														value={value || ''}
														onChange={onChange}
														error={!!error}
														helperText={
															error
																? error.message
																: 'Attract people to your event'
														}></TextField>
												)}
											/>
										</Grid>
									</Grid>

									<Grid item className={classes.inputField}>
										<FormControl>
											<FormLabel className={classes.descriptionLabel}>
												Description{' '}
											</FormLabel>
											<MUIRichTextEditor
												id="descr"
												toolbarButtonSize="small"
												controls={[
													'title',
													'bold',
													'italic',
													'underline',
													'strikethrough',
													'highlight',
													'undo',
													'redo',
													'numberList',
													'bulletList',
													'clear',
												]}
												maxLength={100}
												label="Enter event details"
												onChange={(value) => {
													const content = JSON.stringify(
														convertToRaw(value.getCurrentContent())
													);
													setValue('descr', content);
												}}
											/>
										</FormControl>
									</Grid>
									<Grid item container direction="row">
										{row3}
									</Grid>

									<Grid item container direction="row">
										{row4}
									</Grid>
									<Grid item container direction="row">
										{locationRow}
									</Grid>
									{buttons}
								</form>
							</CardContent>
						</Card>
						<Snackbar
							severity="error"
							className={classes.snackbar}
							open={requestError}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'center',
							}}
							onClose={handleCloseSnackbar}
							TransitionComponent={transitionRight}>
							<Alert onClose={handleCloseSnackbar} severity="error">
								<AlertTitle>
									<strong>{alertTitle}</strong>
								</AlertTitle>
								{errorMsgFormat(subErrorReason)}
							</Alert>
						</Snackbar>
					</Grid>
				</Grid>
			</Grid>
		</>
	);
};
export const getServerSideProps = async function (context) {
	const session = await getSession(context);
	if (!session) {
		return;
	}
	const config = authCookieHeader(session);
	const { data: counties } = await axios.get(
		process.env.SH_API_BASEURL + '/place/ukCounty'
	);
	return {
		props: { counties, session },
	};
};
export default EventAdd;
