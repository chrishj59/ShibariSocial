import {
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  Grid,
  ListItem,
  Paper,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

const useStyles = makeStyles((theme) => ({
	root: {},
	card: {
		opacity: 0.87,
		borderRadius: 15,
		minWidth: 400,
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
		[theme.breakpoints.down('sm')]: {
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
	cardRoot: {
		minWidth: 275,
	},
	listRoot: {
		width: '100%',

		alignItems: 'left',
		backgroundColor: theme.palette.background.paper,
		maxHeight: 180,
		overflow: 'auto',
	},
	tableRoot: {
		'& > *': {
			borderBottom: 'unset',
		},
	},
}));

function DetailsDialog(props) {
	const classes = useStyles();
	const { currentActivity, open } = props;
	return (
		<Dialog aria-labelledby="activity-details-title" open={open}>
			<DialogTitle id="activity-details-title">
				{currentActivity.name} details
			</DialogTitle>
			<Typography>{currentActivity.tagLine}</Typography>
			<Typography>{currentActivity.descr}</Typography>
		</Dialog>
	);
}

// const Row = (props) => {
// 	const { row, openDialog } = props;
// 	const [open, setOpen, setDialogActivity, setOpenDialog] = useState(false);
// 	console.log('Row called with ');
// 	console.log(row);
// 	console.log('day');
// 	console.log(row.day);

// 	const handleClickOpen = (currentRow) => {
// 		setDialogActivity(currentRow);
// 		setOpenDialog(true);
// 	};

// 	const handleDialogClose = () => {
// 		setDialogActivity({});
// 		setOpenDialog(false);
// 	};

// 	return (
// 		<>
// 			<TableRow>
// 				<TableCell>
// 					<IconButton
// 						aria-label="expad row"
// 						size="small"
// 						onClick={() => setOpen(!open)}>
// 						{open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
// 					</IconButton>
// 				</TableCell>
// 				<TableCell component="th" scope="row">
// 					{row.day}
// 				</TableCell>
// 			</TableRow>
// 			<TableRow>
// 				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
// 					<Collapse in={open} timeout="auto" unmountOnExit>
// 						<Box margin={1}>
// 							{/* <Typography variant="h6" gutterBottom component="div">
// 								Event summary
// 							</Typography> */}
// 							<Table size="small" aria-label="events">
// 								<TableBody>
// 									{row.activities.map((actRow) => (
// 										<>
// 											<TableRow key={actRow.id}>
// 												<TableCell>
// 													<Card>
// 														<CardContent>
// 															<Typography color="textPrimary" variant="h5">
// 																{actRow.name}
// 															</Typography>
// 															<Typography color="textSecondary">
// 																{actRow.tagLine}
// 															</Typography>
// 															<Button
// 																size="small"
// 																onClick={(actRow) => handleClickOpen(actRow)}>
// 																Show me more
// 															</Button>
// 															<DetailsDialog
// 																currentActivity={actRow}
// 																open={openDialog}
// 																onClose={handleDialogClose}
// 															/>
// 														</CardContent>
// 													</Card>
// 												</TableCell>
// 											</TableRow>
// 										</>
// 									))}
// 								</TableBody>
// 							</Table>
// 						</Box>
// 					</Collapse>
// 				</TableCell>
// 			</TableRow>
// 		</>
// 	);
//};
const EventOrganising = (props) => {
	const classes = useStyles();
	const theme = useTheme();
	const matchesSm = useMediaQuery(theme.breakpoints.down('sm'));

	const { ownEvents, session, Row } = props;
	const [activities, setActivities] = useState([]);
	const [openDialog, setOpenDialog] = useState(false);
	const [dialogActivity, setDialogActivity] = useState({});

	useEffect(async () => {
		const list1 = await ownEvents.map((item) => {
			item.day = format(new Date(item.startsAt), 'd LLL');
			console.log(item);
			return item;
		});
		let unique = [...new Set(list1.map((e) => e.day))];
		const dayActivities = unique.map((d) => {
			const filtered = list1.filter((a) => a.day === d);

			const listRet = new Array();
			listRet.day = d;
			listRet.activities = filtered;
			return listRet;
		});
		setActivities(dayActivities);
	}, []);
	const activityRender = ownEvents.map((item) => {
		const day = format(new Date(item.startsAt), 'd LLL');
		const startsAt = format(new Date(item.startsAt), ' K:m a');
		const endsAt = format(new Date(item.endsAt), ' K:m a');

		return (
			<ListItem>
				<Typography>
					{day} {startsAt} - {endsAt}
				</Typography>
				<Typography>{item.name}</Typography>
			</ListItem>
		);
	});

	return (
		<Grid container direction="column" justifyContent="center">
			<Grid
				item
				container
				direction="row"
				al
				alignItems="flex-start"
				justifyContent="center">
				<Card className={classes.card} variant="outlined">
					<CardContent>
						<Typography variant="h5" component="h2" alignItems="center">
							My Events
						</Typography>
						{/* <List className={classes.listRoot}>{activityRender}</List> */}
						<TableContainer component={Paper}>
							<Table aria-label="Activities I am organising table">
								{/* <TableHead>
									<TableRow>
										<TableCell />
										<TableCell>Date</TableCell>
										<TableCell>Details</TableCell>
									</TableRow>
								</TableHead> */}
								<TableBody>
									{activities.map((activity) => {
										console.log('activity for row');
										console.log(activity);
										return (
											<Row
												key={activity.id}
												openDialog={openDialog}
												setDialogActivity={setDialogActivity}
												setOpenDialog={setOpenDialog}
												row={activity}
											/>
										);
									})}
								</TableBody>
							</Table>
						</TableContainer>
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	);
};

export default EventOrganising;
