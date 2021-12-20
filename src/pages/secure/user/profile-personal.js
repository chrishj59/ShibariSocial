import 'date-fns';

import { Slide, Snackbar } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Alert, AlertTitle } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import { useEffect, useMemo } from 'react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import useRequest from 'src/utils/clientAxiosRequest';

//import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
//import 'react-phone-input-2/lib/material.css';

const useStyles = makeStyles((theme) => ({
	root: {},
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
	snackbar: {
		opacity: 1.0,
	},
	inputField: {
		paddingRight: '0.5rem',
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
	dropDownRoot: {
		'& .MuiTextField-root': {
			width: '30ch',
			paddingRight: '0.5rem',
		},
	},
	orientationDropDownRoot: {
		'& .MuiTextField-root': {
			width: '15ch',
			paddingRight: '0.5rem',
		},
	},
	datePicker: {
		'& .MuiInput-root': {
			width: '16ch',
		},
	},
	formLabel: {
		marginTop: '0.9em',
		marginRight: '0.5rem',
	},
	locationContainer: {
		flexGrow: 1,
	},
	radioGroup: {
		[theme.breakpoints.down('md')]: {
			marginTop: '2em',
		},
	},
	bioTextField: {
		'& .MuiTextField-root': {
			width: '100%',
		},
	},
	phoneField: {
		margin: '10px 0',
	},
	phoneCountryList: {
		...theme.typography.body1,
	},
}));

function ProfilePersonal(props) {
	const {
		titles = [],
		genders = [],
		pronouns = [],
		orientations = [],
		counties = [],
		dob = new Date(),
		profile = {},

		updateUserDetails,
		axiosConfig,
		session,
	} = props;

	const classes = useStyles();
	const theme = useTheme();
	const matchesSm = useMediaQuery(theme.breakpoints.down('md'));
	const [userDetails, setUserDetails] = useState({});
	const [alertTitle, setAlertTitle] = useState('');
	const [submitError, setSubmitError] = useState(false);
	const [subErrorReason, setSubErrorReason] = useState('');
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const [subSucessReason, setSubSucessReason] = useState(false);
	const [formEntry, setFormEntry] = useState({});
	let url = process.env.NEXT_PUBLIC_SH_API_BASEURL + '/users/profile';
	const { doRequest, formErrors } = useRequest({
		url,
		method: 'post',
		formEntry,
		session,
	});

	const { errors, getValues, reset, register, handleSubmit, watch, control } =
		useForm({
			defaultValues: {
				visibility: 'FR',
				title: '',
				firstName: userDetails.firstName,
				familyName: profile.familyName,
				gender: '',
				pronoun: '',
				orientation: '',
				county: '',
				city: '',
				dob,

				aboutMe: '',
			},
		});
	const countyWatch = watch('county');
	const [cities, setCities] = useState([]);
	const emailRegx =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	useEffect(() => {
		setUserDetails(profile);
		reset({
			firstName: userDetails.firstName,
			familyName: userDetails.familyName,
		});
	}, []);
	useEffect(() => {
		reset({
			firstName: userDetails.firstName,
			familyName: userDetails.familyName,
		});
	}, [userDetails]);

	console.log(errors && errors);

	const handleFormSubmit = async (formData, e) => {
		e.preventDefault();
		setFormEntry(formData);
		//updateUserDetails(formData);
		//formData.append({ loginId: props.loginid });

		// //alert(JSON.stringify(formData));
		// perform update in controller - profile.

		try {
			const data = await doRequest({ body: formData });
			if (data) {
				setSubmitSuccess(true);
			} else if (formErrors) {
				const { response: resp } = err;
				if (statusCode === 401) {
					setAlertTitle('Not signed in');
					setSubErrorReason(`${resp.data.message} -  please sign in`);
				} else if (statusCode === 500) {
					console.log(`servers error ${resp}`);
				} else {
					setAlertTitle('Input error');
					setSubErrorReason(
						`Please check and correct you entry - ${resp.data.message}`
					);
				}
			}
			console.log(formErrors);
		} catch (err) {
			const { response: resp } = err;
			console.log(err);
			setSubmitError(true);
			const status = resp ? resp.status : 500;
			if (status === 401) {
				setAlertTitle('Not signed in');
				setSubErrorReason(`${resp.data.message} -  please sign in`);
			} else if (status === 500) {
				console.log(`servers error ${resp}`);
			} else {
				setAlertTitle('Input error');
				setSubErrorReason(
					`Please check and correct you entry - ${resp.data.message}`
				);
			}
		}
	};

	//const [selectedDate, setSelectedDate] = useState(new Date());

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setSubmitError(false);
		setSubmitSuccess(false);
	};

	const handleCountyChange = async (e) => {
		url =
			process.env.NEXT_PUBLIC_SH_API_BASEURL +
			`/place/ukPlace?county=${e.target.value}`;
		const data = await doRequest({ url, method: 'GET' });
		setCities(data);

		if (formErrors) {
			console.log(formErrors);
		}

		// setFolderName(event.target.value);
	};

	const transitionRight = (props) => {
		return <Slide {...props} direction="right" />;
	};
	const notEmpty = /^[A-Za-z\\s]+$/;
	//const emailRegx = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/;

	const nameRow = (
		<>
			<Grid item className={classes.dropDownRoot}>
				<Controller
					name="title"
					control={control}
					default=""
					render={({ field: { onChange, value }, fieldState: { error } }) => (
						<TextField
							select
							label="Title"
							value={value || ''}
							onChange={onChange}
							error={!!error}
							helperText={error ? error.message : null}>
							{titles &&
								titles.map((option) => (
									<MenuItem key={option.id} value={option.id}>
										{option.name}
									</MenuItem>
								))}
						</TextField>
					)}
				/>
			</Grid>

			<Grid item className={classes.inputField}>
				<Controller
					name="firstName"
					control={control}
					rules={{
						required: { value: true, message: 'First name is required' },
					}}
					render={({ field: { onChange, value }, fieldState: { error } }) => (
						<TextField
							label="First Name"
							value={value || ''}
							onChange={onChange}
							error={!!error}
							helperText={error ? error.message : null}></TextField>
					)}
				/>
			</Grid>
			<Grid item className={classes.inputField}>
				<Controller
					name="familyName"
					control={control}
					rules={{
						required: { value: true, message: 'Family name is required' },
					}}
					render={({ field: { onChange, value }, fieldState: { error } }) => (
						<TextField
							label="Family Name"
							value={value || ''}
							onChange={onChange}
							error={!!error}
							helperText={error ? error.message : null}></TextField>
					)}
				/>
			</Grid>
		</>
	);

	const addrRow = (
		<>
			<Grid item className={classes.inputField}>
				<Controller
					name="email"
					control={control}
					rules={{
						required: false,
						message: 'Enter email',
						pattern: {
							value: emailRegx,
							message: 'Enter a valid email adddress',
						},
					}}
					render={({ field: { onChange, value }, fieldState: { error } }) => (
						<TextField
							label="Email"
							value={value || ''}
							onChange={onChange}
							error={!!error}
							helperText={error ? error.message : null}></TextField>
					)}
				/>
			</Grid>

			<Grid item className={classes.inputField}>
				<Controller
					name="phone_number"
					control={control}
					render={({ field: { onChange, value }, fieldState: { error } }) => (
						<TextField
							label="Telephone"
							type="tel"
							value={value || ''}
							onChange={onChange}
							error={!!error}
							helperText={error ? error.message : null}></TextField>
					)}
				/>
			</Grid>
		</>
	);
	const row2 = (
		<>
			<Grid item className={classes.dropDownRoot}>
				<Controller
					name="gender"
					control={control}
					default=""
					render={({ field: { onChange, value }, fieldState: { error } }) => (
						<TextField
							select
							label="Gender"
							value={value || ''}
							onChange={onChange}
							error={!!error}
							helperText={error ? error.message : null}>
							{genders.map((option) => (
								<MenuItem key={option.id} value={option.id}>
									{option.name}
								</MenuItem>
							))}
						</TextField>
					)}
				/>
			</Grid>
			<Grid item className={classes.dropDownRoot}>
				<Controller
					name="pronoun"
					control={control}
					default=""
					render={({ field: { onChange, value }, fieldState: { error } }) => (
						<TextField
							select
							label="Pronoun"
							value={value || ''}
							onChange={onChange}
							error={!!error}
							helperText={error ? error.message : null}>
							{pronouns.map((option) => (
								<MenuItem key={option.id} value={option.id}>
									{option.name}
								</MenuItem>
							))}
						</TextField>
					)}
				/>
			</Grid>
			<Grid item className={classes.dropDownRoot}>
				<Controller
					name="orientation"
					control={control}
					//default=""
					render={({ field: { onChange, value }, fieldState: { error } }) => (
						<TextField
							select
							label="Orientation"
							value={value || ''}
							onChange={onChange}
							error={!!error}
							helperText={error ? error.message : null}>
							{orientations.map((option) => (
								<MenuItem key={option.id} value={option.id}>
									{option.name}
								</MenuItem>
							))}
						</TextField>
					)}
				/>
			</Grid>
		</>
	);

	const dobRow = (
		<>
			<Grid item>
				<Controller
					name="dob"
					control={control}
					default={new Date()}
					render={({ field: { onChange, value }, fieldState: { error } }) => (
						<DatePicker
							className={classes.datePicker}
							margin="normal"
							id="dob-dialog"
							//label="Date of Birth"
							format="dd/MM/yyyy"
							value={value}
							onChange={onChange}
							KeyboardButtonProps={{
								'aria-label': 'change date',
							}}
							renderInput={(props) => (
								<TextField label="Date of birth" helperText="Something" />
							)}
						/>
					)}
				/>
			</Grid>
		</>
	);

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
					name="city"
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

			<Grid item className={classes.radioGroup}>
				<Controller
					name="visibility"
					control={control}
					default="FR"
					render={({ field: { onChange, value }, fieldState: { error } }) => (
						<FormControl component="fieldset">
							<FormLabel
								component="legend"
								justify="center"
								style={{ color: 'purple' }}>
								Display location
							</FormLabel>
							<RadioGroup
								aria-label="visibility"
								name="visibility1"
								row={!matchesSm ? true : false}
								value={value || 'FR'}
								onChange={onChange}>
								<FormControlLabel
									value="ALL"
									color={theme.palette.primary}
									control={<Radio />}
									label="All users"
								/>
								<FormControlLabel
									value="FR"
									control={<Radio />}
									label="Fiends"
								/>
								<FormControlLabel
									value="N"
									control={<Radio />}
									label="No one"
								/>
							</RadioGroup>
						</FormControl>
					)}
				/>
			</Grid>
		</>
	);
	{
		/* rules={{
	required: {
		value: true,
		message: 'You must select a title',
	},
}} */
	}
	const bioRow = (
		<>
			<Grid item style={{ marginTop: '1rem' }}>
				<Controller
					name="aboutMe"
					control={control}
					//default=""
					render={({ field: { onChange, value }, fieldState: { error } }) => (
						<TextField
							label="All about me"
							multiline
							maxRows={4}
							value={value || ''}
							onChange={onChange}
							variant="outlined"
							style={{ width: '80vw', maxWidth: '100%' }}
						/>
					)}
				/>
			</Grid>
		</>
	);

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

	return (
		<>
			<Grid container direction="column" justifyContent="center">
				<Grid item style={{ textAlign: 'center' }}>
					<Typography variant="h4" gutterBottom>
						It&apos;s all about you!!
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
										{nameRow}
									</Grid>
									<Grid container item>
										{addrRow}
									</Grid>
									<Grid container item>
										{row2}
									</Grid>
									<Grid container item>
										{dobRow}
									</Grid>
									<Grid container item className={classes.locationContainer}>
										{locationRow}
									</Grid>
									<Grid container item>
										{bioRow}
									</Grid>
									{buttons}
									<Snackbar
										severity="success"
										className={classes.snackbar}
										open={submitSuccess}
										anchorOrigin={{
											vertical: 'bottom',
											horizontal: 'center',
										}}
										onClose={handleClose}
										TransitionComponent={transitionRight}
										autoHideDuration={30000}>
										<Alert onClose={handleClose} severity="success">
											<AlertTitle>
												<strong>Saved</strong>
											</AlertTitle>
											<strong>Personal details have been saved</strong>
										</Alert>
									</Snackbar>
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
												<strong>{alertTitle}</strong>
											</AlertTitle>
											<strong>{subErrorReason}</strong>
										</Alert>
									</Snackbar>
								</form>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</Grid>
		</>
	);
}

export default ProfilePersonal;
