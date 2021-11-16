import {
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import axios from 'axios';
import { format, formatDistanceToNow } from 'date-fns';
import { convertToRaw } from 'draft-js';
import MUIRichTextEditor from 'mui-rte';
import { getSession } from 'next-auth/client';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import NumberFormat from 'react-number-format';
import { ShiButton } from 'src/components/ui/Button';
import { authCookieHeader } from 'src/utils/authReqHeader';

import EventAttending from './event-attending';
import EventFriends from './event-friend';
import EventNearBy from './event-nearby';
import EventOrganising from './event-organising';

// import Box from '@material-ui/core/Box';
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
	details: {
		width: 400,
	},
	textDisplay: {
		minWidth: 600,
	},
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
	dialogField: {
		paddingRight: '0.5rem',
		marginRight: '1rem',
	},
	dialogFieldNumber: {
		paddingRight: '0.5rem',
		marginRight: '2rem',
	},

	dialogFormTagLine: {
		color: theme.palette.common.blue,
		fontWeight: 600,
	},
	dialogFormBody: {
		fontWeight: 400,
	},
}));

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}>
			{value === index && <Box p={3}>{children}</Box>}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};

function a11yProps(index) {
	return {
		id: `nav-tab-${index}`,
		'aria-controls': `nav-tabpanel-${index}`,
	};
}

const StyledTab = withStyles((theme) => ({
	root: {
		textTransform: 'none',
		color: theme.palette.common.blue,
		fontFamily: 'Roboto',
		fontWeight: theme.typography.fontWeightRegular,
		[theme.breakpoints.down('sm')]: {
			fontSize: theme.typography.pxToRem(20),
		},
		[theme.breakpoints.up('sm')]: {
			fontSize: theme.typography.pxToRem(30),
		},
		marginRight: theme.spacing(1),
		'&:focus': {
			opacity: 1,
		},
	},
}))((props) => <Tab disableRipple {...props} />);

const defaultValues = {
	EVENT_DESCRIPTION: '',
};
const FetishEvent = (props) => {
	const [tabValue, setTabValue] = useState(0);
	const [openAddDialog, setOpenAddDialog] = useState(false);

	const classes = useStyles();
	const theme = useTheme();
	const {
		errors,
		getValues,
		setValue,
		reset,
		register,
		handleSubmit,
		watch,
		control,
	} = useForm(defaultValues);

	const { ownEvents, session } = props;
	console.log(props);
	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};

	const openAddEventDialog = (e) => {
		setOpenAddDialog(true);
	};

	const handleFormSubmit = async (formData, e) => {
		e.preventDefault();
		console.log('formData');
		console.log(formData);
	};
	useEffect(() => {
		register('EVENT_DESCRIPTION');
	}, [register]);

	const Row = (props) => {
		const { row } = props;
		const [open, setOpen] = useState(false);
		const [openDialog, setOpenDialog] = useState(false);
		const [dialogActivity, setDialogActivity] = useState({});

		console.log('Row called with ');
		console.log(row);
		console.log(row.activities[0].startsAt);
		console.log('day');
		console.log(row.day);

		const handleClickOpen = (currentRow) => {
			setDialogActivity(currentRow);
			setOpenDialog(true);
		};

		const handleDialogClose = () => {
			setDialogActivity({});
			setOpenDialog(false);
		};

		function DetailsDialog(props) {
			const classes = useStyles();
			const { currentActivity, openDialog } = props;
			console.log('currentActivity');

			console.log(currentActivity);

			const startDate = format(
				new Date(currentActivity.startsAt),
				'd MMM h mm a'
			);
			const endDate = format(new Date(currentActivity.endsAt), 'd MMM h mm a');

			return (
				<Dialog
					aria-labelledby="activity-details-title"
					open={openDialog}
					fullWidth>
					<DialogTitle id="activity-details-title">
						{currentActivity.name} details
					</DialogTitle>
					<DialogContent>
						<Grid container direction="row">
							<Grid container item justifyContent="center">
								<Grid item>
									<Typography className={classes.dialogFormTagLine}>
										{currentActivity.tagLine}
									</Typography>
								</Grid>
							</Grid>

							<Grid container item direction="column">
								{/* Descrption */}

								<Grid item>
									<MUIRichTextEditor
										label="Descr"
										toolbar={false}
										defaultValue={currentActivity.descr}
										label="Start typing..."
									/>
								</Grid>
							</Grid>
							<Grid container item direction="row">
								{/* Duration */}
								<Grid item>
									<Typography
										color="textPrimary"
										gutterBottom
										className={classes.dialogField}>
										When
									</Typography>
								</Grid>
								<Grid item>
									<Typography gutterBottom color="textSecondary">
										{startDate} until {endDate}
									</Typography>
								</Grid>
							</Grid>
							<Grid container item direction="row">
								{/* Cost */}
								<Grid item>
									<Typography
										className={classes.dialogFieldNumber}
										color="textPrimary">
										Cost
									</Typography>
								</Grid>
								<Grid item>
									<NumberFormat
										value={currentActivity.cost}
										customInput={TextField}
										thousandSeparator={true}
										decimalScale={2}
										fixedDecimalScale={true}
										alignItems="right"
										disabled
									/>
								</Grid>
							</Grid>
							<Grid container item direction="row">
								{/* Location and dress code */}
								<Grid item>
									<Typography
										className={classes.dialogField}
										color="textPrimary">
										Held at
									</Typography>
								</Grid>
								<Grid item>
									<Typography className={classes.dialogField}>
										{currentActivity.cityName}
									</Typography>
								</Grid>
							</Grid>
							<Grid container item direction="row">
								<Grid item>
									<Typography
										className={classes.dialogField}
										color="textPrimary">
										Dress Code
									</Typography>
								</Grid>
								<Grid item>
									<Typography>{currentActivity.dressCode}</Typography>
								</Grid>
							</Grid>
						</Grid>
						<DialogActions>
							<Button onClick={handleDialogClose}>I've seen enough</Button>
						</DialogActions>
						{/* <Grid container item direction="row" justifyContent="center">
							<Grid item>
								<Button onClick={handleDialogClose}>I've seen enough</Button>
							</Grid>
						</Grid> */}
					</DialogContent>
				</Dialog>
			);
		}

		return (
			<>
				<TableRow>
					<TableCell>
						<IconButton
							aria-label="expad row"
							size="small"
							onClick={() => setOpen(!open)}>
							{open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
						</IconButton>
					</TableCell>
					<TableCell component="th" scope="row">
						<Typography>
							{row.day}
							{' - '}
							{formatDistanceToNow(new Date(row.activities[0].startsAt), {
								addSuffix: true,
							})}
						</Typography>
					</TableCell>
				</TableRow>
				<TableRow>
					<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
						<Collapse in={open} timeout="auto" unmountOnExit>
							<Box margin={1}>
								{/* <Typography variant="h6" gutterBottom component="div">
								Event summary
							</Typography> */}
								<Table size="small" aria-label="events">
									<TableBody>
										{row.activities.map((actRow) => (
											<>
												<TableRow key={actRow.id}>
													<TableCell>
														<Card>
															<CardContent>
																<Typography color="textPrimary" variant="h5">
																	{actRow.name}
																</Typography>
																<Typography color="textSecondary">
																	{actRow.tagLine}
																</Typography>
																<Button
																	size="small"
																	onClick={(actRow) => handleClickOpen(actRow)}>
																	Show me more
																</Button>
																<DetailsDialog
																	currentActivity={actRow}
																	openDialog={openDialog}
																	onClose={handleDialogClose}
																/>
															</CardContent>
														</Card>
													</TableCell>
												</TableRow>
											</>
										))}
									</TableBody>
								</Table>
							</Box>
						</Collapse>
					</TableCell>
				</TableRow>
			</>
		);
	};
	return (
		<>
			<Grid container direction="row">
				<Grid item container direction="row" justifyContent="flex-end">
					<Grid item>
						<ShiButton
							path="/secure/events/eventAdd"
							text="Add Event"
							size="large"
							width="10px"
							onClick={(e) => openAddEventDialog(e)}
						/>
					</Grid>
				</Grid>
				<Grid
					container
					direction="row"
					justifyContent="center"
					alignItems="center">
					<Tabs
						variant={'standard'}
						value={tabValue}
						onChange={handleTabChange}
						textColor="secondary"
						aria-label="nav tabs example">
						<StyledTab label="Nearby" {...a11yProps(0)} />
						<StyledTab label="Friends" {...a11yProps(1)} />
						<StyledTab label="Attending" {...a11yProps(2)} />
						<StyledTab label="Organsing" {...a11yProps(3)} />
					</Tabs>
				</Grid>
			</Grid>
			<TabPanel value={tabValue} index={0}>
				<EventNearBy />
			</TabPanel>
			<TabPanel value={tabValue} index={1}>
				<EventFriends />
			</TabPanel>
			<TabPanel value={tabValue} index={2}>
				<EventAttending />
			</TabPanel>
			<TabPanel value={tabValue} index={3}>
				<EventOrganising ownEvents={ownEvents} session={session} Row={Row} />
			</TabPanel>
			<Dialog
				onClose={(escapeKeyDown, backdropClick) => null}
				maxWidth="xs"
				open={openAddDialog}
				aria-labelledby="add-event-dialog-title">
				<DialogTitle id="add-event-dialog-title">
					<Typography variant="h4">Your new event</Typography>
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<Typography variant="h6">
							Promote your event munch, education or play time
						</Typography>
					</DialogContentText>
					<Grid container direction="column" justifyContent="flex-start">
						<Grid
							item
							container
							direction="row"
							alignItems="flex-start"
							justifyContent="flex-start">
							<form onSubmit={handleSubmit(handleFormSubmit)}>
								<Grid item className={classes.inputField}>
									<Controller
										name="eventName"
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
													error ? error.message : 'Searchable name of the event'
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
													error ? error.message : 'Attract people to your event'
												}></TextField>
										)}
									/>
								</Grid>
								<Grid item className={classes.inputField}>
									<MUIRichTextEditor
										toolbarButtonSize="small"
										inlineToolbar
										label="Enter event details"
										onChange={(value) => {
											const content = JSON.stringify(
												convertToRaw(value.getCurrentContent())
											);
											setValue('EVENT_DESCRIPTION', content);
										}}
									/>
								</Grid>
								<button>submit</button>
							</form>
						</Grid>
					</Grid>
				</DialogContent>
			</Dialog>
		</>
	);
};

export const getServerSideProps = async function (context) {
	const session = await getSession(context);
	if (!session) {
		console.log('Profile no props');
		res.setHeader('location', '/');
		res.statusCode = 401;
		res.end();
		return { props: {} };
	}
	let ownEvents = [];
	const config = authCookieHeader(session);
	if (session) {
		try {
			const { data } = await axios.get(
				process.env.SH_API_BASEURL + `/activity/organising`,
				config
			);
			console.log('data');
			console.log(data);
			ownEvents = data;
		} catch (err) {
			console.log(err);
		}
	}
	return {
		props: { session, ownEvents },
	};
};

export default FetishEvent;
