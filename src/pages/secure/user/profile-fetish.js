import {
  Button,
  CardHeader,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Radio,
  RadioGroup,
  Snackbar,
  TextField,
  Typography,
} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { Alert, AlertTitle } from '@material-ui/lab';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useEffect, useState } from 'react';
import useRequest from 'src/utils/clientAxiosRequest';

const useStyles = makeStyles((theme) => ({
	card: {
		opacity: 0.95,
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
	button: {
		textTransform: 'none',
	},
	snackbar: {
		opacity: 1.0,
	},
	root: {
		width: '100%',
		height: 400,
		maxWidth: 300,
		backgroundColor: theme.palette.background.paper,
	},
	nested: {
		paddingLeft: theme.spacing(4),
	},
	nested2: {
		paddingLeft: theme.spacing(6),
	},
}));
const ProfileFetish = (props) => {
	const classes = useStyles();
	const theme = useTheme();
	const {
		fetishes = [],
		userFetishes,
		session,
		addProfileFetish,
		userDetails,
		deleteUserFetish,
	} = props;
	console.log('profile-fetish props');
	console.log(props);

	console.log(userFetishes);

	const [selectedFetish, setSelectedFetish] = useState({});
	const [openFetDialog, setOpenFetDialog] = useState(false);
	const [receivingFetish, setReceivingFetish] = useState('');
	const [givingFetish, setGivingFetish] = useState('');
	const [myGiving, setMyGiving] = useState([]);
	const [myRecieving, setMyRecieving] = useState([]);
	const [givingOpen, setGivingOpen] = useState(false);
	const [givingIntoOpen, setGivingIntoOpen] = useState(false);
	const [givingCuriousOpen, setGivingCuriousOpen] = useState(false);
	const [givingSoftOpen, setGivingSoftOpen] = useState(false);
	const [givingHardOpen, setGivingHardOpen] = useState(false);
	const [givingUndecidedOpen, setGivingUndecidedOpen] = useState(false);
	const [receivingOpen, setReceivingOpen] = useState(false);
	const [receivingIntoOpen, setReceivingIntoOpen] = useState(false);
	const [receivingCuriousOpen, setReceivingCuriousOpen] = useState(false);
	const [receivingSoftOpen, setReceivingSoftOpen] = useState(false);
	const [receivingHardOpen, setReceivingHardOpen] = useState(false);
	const [receivingUndecidedOpen, setReceivingUndecidedOpen] = useState(false);
	const [submitError, setSubmitError] = useState(false);
	const [alertTitle, setAlertTitle] = useState('');
	const [subErrorReason, setSubErrorReason] = useState('');

	const collator = new Intl.Collator('en', {
		numeric: true,
		sensitivity: 'base',
	});

	useEffect(() => {
		console.log('in use effect');
		console.log(userFetishes);
		if (!userFetishes) {
			console.log('No fetishes');
			return;
		}
		let giving = userFetishes.filter((el) => el.give);
		console.log('giving', giving);
		giving = giving.sort((a, b) => collator.compare(a.give, b.give));
		setMyGiving(giving);
		console.log('myGiving ', myGiving);
		const receiving = userFetishes.filter((el) => el.recieve);
		console.log('receiving after filter', receiving);
	}, []);

	let url = process.env.NEXT_PUBLIC_SH_API_BASEURL + '/users/userfetish';
	const { doRequest, formErrors } = useRequest({
		url,
		method: 'post',
		formData: {},
		session,
		onError: (errResp) => {
			console.log('errResp');
			console.log(errResp);
		},
	});

	const onFetishChange = (e, fet, reason) => {
		console.log('fetish selected');
		if (reason === 'clear') {
			setOpenFetDialog(false);
			return;
		}
		console.log(fet);
		console.log(reason);
		setSelectedFetish(fet);
		setOpenFetDialog(true);
	};

	const handleSnackbarClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setSubmitError(false);
	};

	const transitionRight = (props) => {
		return <Slide {...props} direction="right" />;
	};

	const handleGivingClick = () => {
		setGivingOpen(!givingOpen);
	};

	const handleGivingIntoClick = () => {
		setGivingIntoOpen(!givingIntoOpen);
	};

	const handleGivingCuriousClick = () => {
		setGivingCuriousOpen(!givingCuriousOpen);
	};

	const handleGivingSoftClick = () => {
		setGivingSoftOpen(!givingSoftOpen);
	};

	const handleGivingHardClick = () => {
		setGivingHardOpen(!givingHardOpen);
	};

	const handleGivingUndecidedClick = () => {
		setGivingUndecidedOpen(!givingUndecidedOpen);
	};

	const handleReceivingClick = () => {
		setReceivingOpen(!receivingOpen);
	};

	const handleReceivingIntoClick = () => {
		setReceivingIntoOpen(!receivingIntoOpen);
	};

	const handleReceivingCuriousClick = () => {
		setReceivingCuriousOpen(!receivingCuriousOpen);
	};

	const handleReceivingSoftClick = () => {
		setReceivingSoftOpen(!receivingSoftOpen);
	};

	const handleReceivingHardClick = () => {
		setReceivingHardOpen(!receivingHardOpen);
	};

	const handleReceivingUndecidedClick = () => {
		setReceivingUndecidedOpen(!receivingUndecidedOpen);
	};

	const deleteProfileFetish = async (e, profileFetish) => {
		const { id } = profileFetish;
		url = `${url}?fetishId=${id}&userId=${userDetails.id}`;
		try {
			const data = await doRequest({
				method: 'DELETE',
				url,
			});
			const { status } = data;
			if (status === 'ERROR') {
				setSubmitError(true);
				setAlertTitle('Add your fetish issue');
				setSubErrorReason(
					`Could not assign the fetish - please come back to the page and try again `
				);
			}
			console.log(`respone from api delete: ${JSON.stringify(data)}`);
			deleteUserFetish(id);
		} catch (err) {
			console.error(`Error from api delete: ${JSON.stringify(err)}`);
			setSubmitError(true);
			setAlertTitle('Unexpected error');
			setSubErrorReason(`An unexpected error occurred - please retry`);
		}
	};

	const renderSubList = (items, name, handleClick, isOpen) => (
		<>
			<ListItem button onClick={handleClick} className={classes.nested}>
				<ListItemText primary={name} />
				{isOpen ? <ExpandLess /> : <ExpandMore />}
			</ListItem>
			<Collapse in={isOpen} timeout="auto" unmountOnExit>
				<List component="div" disablePadding>
					{items.map((el) => (
						<ListItem key={el.id} className={classes.nested2}>
							<ListItemText primary={el.fetish.name} />
							<ListItemSecondaryAction>
								<IconButton
									onClick={(e) => deleteProfileFetish(e, el)}
									edge="end"
									aria-label="delete">
									<DeleteForeverIcon />
								</IconButton>
							</ListItemSecondaryAction>
						</ListItem>
					))}
				</List>
			</Collapse>
		</>
	);

	const renderMyFetishListItem = () => {
		if (!userFetishes) {
			return;
		}
		const givingList = userFetishes
			.filter((el) => el.giveLevel)
			.sort((a, b) => collator.compare(a.giveLevel, b.giveLevel));
		const givingInto = givingList
			.filter((el) => el.giveLevel === 'into')
			.sort((a, b) => collator.compare(a.fetish.name, b.fetish.name));
		const givingCurious = givingList
			.filter((el) => el.giveLevel === 'curious')
			.sort((a, b) => collator.compare(a.fetish.name, b.fetish.name));
		const givingSoft = givingList
			.filter((el) => el.giveLevel === 'soft_limit')
			.sort((a, b) => collator.compare(a.fetish.name, b.fetish.name));
		const givingHard = givingList
			.filter((el) => el.giveLevel === 'hard_limit')
			.sort((a, b) => collator.compare(a.fetish.name, b.fetish.name));
		const givingUndecided = givingList
			.filter((el) => el.giveLevel === 'undecided')
			.sort((a, b) => collator.compare(a.fetish.name, b.fetish.name));

		const receivingList = userFetishes
			.filter((el) => el.receiveLevel)
			.sort((a, b) => collator.compare(a.giveLevel, b.giveLevel));
		const receivingInto = receivingList
			.filter((el) => el.receiveLevel === 'into')
			.sort((a, b) => collator.compare(a.fetish.name, b.fetish.name));
		const receivingCurious = receivingList
			.filter((el) => el.receiveLevel === 'curious')
			.sort((a, b) => collator.compare(a.fetish.name, b.fetish.name));
		const receivingSoft = receivingList
			.filter((el) => el.receiveLevel === 'soft_limit')
			.sort((a, b) => collator.compare(a.fetish.name, b.fetish.name));
		const receivingHard = receivingList
			.filter((el) => el.receiveLevel === 'hard_limit')
			.sort((a, b) => collator.compare(a.fetish.name, b.fetish.name));
		const receivingUndecided = receivingList
			.filter((el) => el.receiveLevel === 'undecided')
			.sort((a, b) => collator.compare(a.fetish.name, b.fetish.name));
		return (
			<>
				{/* <ListSubheader subheader={<li />}>
					<li> 
						<ul style={{padding: 0}}></ul>
					</li>
						Subheader</ListSubheader>
				<ListItem>
					<ListItemText>Item text</ListItemText>
				</ListItem> */}
				{givingList && (
					<>
						<ListItem button onClick={handleGivingClick}>
							<ListItemText primary="Giving" />
							{givingOpen ? <ExpandLess /> : <ExpandMore />}
						</ListItem>
						<Collapse in={givingOpen} timeout="auto" unmountOnExit>
							{givingInto.length > 0 && (
								<List component="div" disablePadding>
									{renderSubList(
										givingInto,
										'Into',
										handleGivingIntoClick,
										givingIntoOpen
									)}
								</List>
							)}
							{givingCurious.length > 0 && (
								<List component="div" disablePadding>
									{renderSubList(
										givingCurious,
										'Curious',
										handleGivingCuriousClick,
										givingCuriousOpen
									)}
								</List>
							)}
							{givingSoft.length > 0 && (
								<List component="div" disablePadding>
									{renderSubList(
										givingSoft,
										'Soft Limit',
										handleGivingSoftClick,
										givingSoftOpen
									)}
								</List>
							)}
							{givingHard.length > 0 && (
								<List component="div" disablePadding>
									{renderSubList(
										givingHard,
										'Hard Limit',
										handleGivingHardClick,
										givingHardOpen
									)}
								</List>
							)}
							{givingUndecided.length > 0 && (
								<List component="div" disablePadding>
									{renderSubList(
										givingUndecided,
										'Undecided',
										handleGivingUndecidedClick,
										givingUndecidedOpen
									)}
								</List>
							)}
						</Collapse>
					</>
				)}
				{receivingList && (
					<>
						<ListItem button onClick={handleReceivingClick}>
							<ListItemText primary="Receiving" />
							{receivingOpen ? <ExpandLess /> : <ExpandMore />}
						</ListItem>
						<Collapse in={receivingOpen} timeout="auto" unmountOnExit>
							{receivingInto.length > 0 && (
								<List component="div" disablePadding>
									{renderSubList(
										receivingInto,
										'Into',
										handleReceivingIntoClick,
										receivingIntoOpen
									)}
								</List>
							)}
							{receivingCurious.length > 0 && (
								<List component="div" disablePadding>
									{renderSubList(
										receivingCurious,
										'Curious',
										handleReceivingCuriousClick,
										receivingCuriousOpen
									)}
								</List>
							)}
							{receivingSoft.length > 0 && (
								<List component="div" disablePadding>
									{renderSubList(
										receivingSoft,
										'Soft Limit',
										handleReceivingSoftClick,
										receivingSoftOpen
									)}
								</List>
							)}
							{receivingHard.length > 0 && (
								<List component="div" disablePadding>
									{renderSubList(
										receivingHard,
										'Hard Limit',
										handleReceivingHardClick,
										receivingHardOpen
									)}
								</List>
							)}
							{receivingUndecided.length > 0 && (
								<List component="div" disablePadding>
									{renderSubList(
										receivingUndecided,
										'Undecided',
										handleReceivingUndecidedClick,
										receivingUndecidedOpen
									)}
								</List>
							)}
						</Collapse>
					</>
				)}
			</>
		);
	};
	const renderRetishesAvailRow = (props) => {
		// console.log(`renderRetishesAvailRow lenhth ${fetishes.length}`);
		// const { index, style } = props;
		console.log('myGiving', myGiving);
		return (
			<Autocomplete
				options={fetishes}
				getOptionLabel={(option) => option.name}
				getOptionSelected={(option) => {
					if (Object.keys(option).length !== 0) {
						return option;
					} else return '';
				}}
				onChange={onFetishChange}
				renderInput={(params) => (
					<TextField
						{...params}
						variant="standard"
						label="Choose your Fetish"
						placeholder="Enter text to search fetishes"
						margin="normal"
						fullWidth
					/>
				)}
			/>
		);
	};

	const handleCloseFetishDlg = () => {
		setOpenFetDialog(false);
	};

	const handleReceivingChange = (event) => {
		setReceivingFetish(event.target.value);
	};

	const handleGivingChange = (e) => {
		setGivingFetish(e.target.value);
	};

	const handleAddProfileFetish = async () => {
		console.log('addProfileFetish called');
		console.log(receivingFetish);
		console.log(givingFetish);
		const profileFetish = {};
		profileFetish['fetish'] = selectedFetish;
		if (receivingFetish) {
			profileFetish['receiveLevel'] = receivingFetish;
			//addProfileFetish(selectedFetish, receivingFetish);
		}
		if (givingFetish) {
			profileFetish['giveLevel'] = givingFetish;
		}
		const body = {
			give: givingFetish,
			receive: receivingFetish,
			userId: userDetails.id,
			fetishId: selectedFetish.id,
		};
		try {
			const data = await doRequest({ body });
			console.log(`data: ${JSON.stringify(data)}`);
			console.log(`formErrors: ${JSON.stringify(formErrors)}`);

			if (data) {
				const { status } = data;
				if (status === 'ERROR') {
					setSubmitError(true);
					setAlertTitle('Add your fetish issue');
					setSubErrorReason(
						`Could not assign the fetish - please come back to the page and try again `
					);
				}
				addProfileFetish(profileFetish);
				setOpenFetDialog(!openFetDialog);
				setSelectedFetish('');
				setReceivingFetish('');
				setGivingFetish('');
			} else if (formErrors) {
				alert(JSON.stringify(formErrors));
			}
		} catch (err) {
			console.log(`Other error ${err}`);
			setSubmitError(true);
			setAlertTitle('Unexpected error');
			setSubErrorReason(`An unexpected error occurred - please retry`);
		}
	};

	return (
		<>
			<Grid container direction="column" justifyContent="center">
				<Grid item container direction="row">
					<Grid item md={8}>
						{/* List of current relationships   */}
						<Grid
							item
							container
							direction="row"
							alignItems="flex-end"
							justifyContent="center">
							<Card className={classes.card}>
								<CardHeader title="My Fetishes" />

								<CardContent className={classes.details}>
									<List>{renderMyFetishListItem()}</List>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
					<Grid item>
						{/*valid Ds relationships */}
						<Card className={classes.card}>
							<CardHeader title="Available Fetishes" />
							<CardContent className={classes.details}>
								<List>{renderRetishesAvailRow()}</List>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</Grid>
			<Dialog
				onClose={(escapeKeyDown, backdropClick) => null}
				maxWidth="xs"
				open={openFetDialog}
				aria-labelledby="fetish-dialog-title">
				<DialogTitle id="fetish-dialog-title">
					<Typography variant="h4">My new Fetish</Typography>
				</DialogTitle>
				<DialogContent dividers>
					<Typography>
						Add <strong>{selectedFetish && selectedFetish.name}</strong> to my
						fetishes
					</Typography>
					<Grid
						container
						direction="row"
						justifyContent="space-evenly"
						style={{ marginTop: '5px' }}>
						<Grid item>
							<FormControl component="fieldset">
								<FormLabel component="legend">Receiving</FormLabel>

								<RadioGroup
									aria-label="receiving"
									name="receiving"
									value={receivingFetish}
									onChange={handleReceivingChange}>
									<FormControlLabel
										value="into"
										control={<Radio />}
										label="Into"
									/>
									<FormControlLabel
										value="curious"
										control={<Radio />}
										label="Curious"
									/>
									<FormControlLabel
										value="hard_limit"
										control={<Radio />}
										label="Hard limit"
									/>
									<FormControlLabel
										value="soft_limit"
										control={<Radio />}
										label="Soft limit"
									/>
									<FormControlLabel
										value="undecided"
										control={<Radio />}
										label="Undecided"
									/>
								</RadioGroup>
							</FormControl>
						</Grid>
						<Grid item>
							<FormControl component="fieldset">
								<FormLabel component="legend">Giving</FormLabel>
								<RadioGroup
									aria-label="givingFetish"
									name="givingFetish"
									value={givingFetish}
									onChange={handleGivingChange}>
									<FormControlLabel
										value="into"
										control={<Radio />}
										label="Into"
									/>
									<FormControlLabel
										value="curious"
										control={<Radio />}
										label="Curious"
									/>
									<FormControlLabel
										value="hard_limit"
										control={<Radio />}
										label="Hard limit"
									/>
									<FormControlLabel
										value="soft_limit"
										control={<Radio />}
										label="Soft limit"
									/>
									<FormControlLabel
										value="undecided"
										control={<Radio />}
										label="Undecided"
									/>
								</RadioGroup>
							</FormControl>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button
						className={classes.button}
						variant="contained"
						size="medium"
						color="primary"
						type="button"
						onClick={handleAddProfileFetish}>
						Yea, add
					</Button>
					<Button
						className={classes.button}
						variant="contained"
						size="medium"
						color="secondary"
						type="button"
						onClick={handleCloseFetishDlg}>
						No thanks
					</Button>
				</DialogActions>
			</Dialog>
			<Snackbar
				severity="error"
				className={classes.snackbar}
				open={submitError}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				onClose={handleSnackbarClose}
				TransitionComponent={transitionRight}>
				<Alert onClose={handleSnackbarClose} severity="error">
					<AlertTitle>
						<strong>{alertTitle}</strong>
					</AlertTitle>
					<strong>{subErrorReason}</strong>
				</Alert>
			</Snackbar>
		</>
	);
};
export default ProfileFetish;
