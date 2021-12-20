import {
  Button,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItemSecondaryAction,
  ListItemText,
  Slide,
  Snackbar,
  TextField,
} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import { Alert, AlertTitle } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import React, { useEffect, useState } from 'react';
import useRequest from 'src/utils/clientAxiosRequest';

//import Button from 'src/ui/Button';

const useStyles = makeStyles((theme) => ({
	card: {
		opacity: 0.87,
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
	// details: {
	// 	display: 'flex',
	// 	direction: 'column',
	// },
}));

function ProfileRelationShips(props) {
	const classes = useStyles();
	const theme = useTheme();

	const [openSingleRelDialog, setOpenSingleRelDialog] = useState(false);
	const [openJointRelDialog, setOpenJointRelDialog] = useState(false);
	const [openSingleDsRelDialog, setOpenSingleDsRelDialog] = useState(false);
	const [openJointDsRelDialog, setOpenJointDsRelDialog] = useState(false);
	//const [validRelationships, setValidRelationships] = useState([]);
	const [selectedRel, setSelectedRel] = useState({});
	const [selectedDsRel, setSelectedDsRel] = useState({});
	const [submitError, setSubmitError] = useState(false);
	const [submitDsError, setSubmitDsError] = useState(false);
	const [alertTitle, setAlertTitle] = useState('');
	const [subErrorReason, setSubErrorReason] = useState('');

	const {
		relationships = [],

		userDetails,
		updateRelationships,
		deleteRelationship,
		userRelationships,
		session,
		dsRelationships,
		userDsRelationships,
		deleteDsRelationship,
		updateDsRelationships,
	} = props;

	console.log('props.relationships');
	console.log(relationships);
	let url =
		process.env.NEXT_PUBLIC_SH_API_BASEURL + '/users/profileRelationship';
	const { doRequest, errors } = useRequest({
		url,
		method: 'patch',
		formData: null,
		session,
		onError: (errResp) => {
			console.log('errResp');
			console.log(errResp);
		},
	});

	// console.log('profile-relationships');
	// console.log(userDetails);
	// useEffect(() => {
	// 	if (userDetails.friendsCount > 0) {
	// 		setValidRelationships(relationships);
	// 	} else {
	// 		const filteredRelationships = relationships.filter(
	// 			(el) => !el.hasOtherPerson
	// 		);
	// 		setValidRelationships(filteredRelationships);
	// 	}
	// }, [userDetails]);

	// const Transition = React.forwardRef(function Transition(props, ref) {
	// 	return <Slide direction="up" ref={ref} {...props} />;
	// });

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setSubmitError(false);
	};

	const transitionRight = (props) => {
		return <Slide {...props} direction="right" />;
	};

	const onDsRelationshipChange = (event, value) => {
		console.log('onDsRelationshipChange');
		console.log(value);
		if (!value) {
			setSelectedDsRel({});
			return;
		}
		if (!value.hasOtherPerson) {
			setOpenSingleDsRelDialog(true);
		} else {
			setOpenJointDsRelDialog(true);
		}
		setSelectedDsRel(value);
	};
	const onRelationshipChange = (event, value) => {
		console.log(value);
		if (!value) {
			setSelectedRel({});
			return;
		}
		if (!value.hasOtherPerson) {
			setOpenSingleRelDialog(true);
		} else {
			setOpenJointRelDialog(true);
		}
		setSelectedRel(value);
	};

	const handleCloseSingleDlg = () => {
		setOpenSingleRelDialog(false);
	};

	const handleCloseSingleDsDlg = () => {
		setOpenSingleDsRelDialog(false);
	};

	const handleCloseJointDlg = () => {
		setOpenJointRelDialog(false);
	};

	const handleCloseJointDsRelDlg = () => {
		setOpenJointDsRelDialog(false);
	};

	const handleAddSinglDsRel = async () => {
		console.log('handleAddSingleDsRel called');
	};

	const handleAddSingleRel = async () => {
		console.log('handleAddSingleRel called');
		console.log(selectedRel);
		setSubmitError(false);
		url = `${url}?relationshipId=${selectedRel.id}&profileId=${userDetails.id}`;

		const data = await doRequest({
			url,
		});

		if (data) {
			console.log('update okay');
			console.log(data);
			const { status, message } = data;
			if (status === 'ERROR') {
				if (message.startsWith('duplicate key')) {
					setSubmitError(true);
					setAlertTitle('Duplicate relationship');
					setSubErrorReason(
						`You already have this relationship - please choose another`
					);
				}
			} else {
				updateRelationships(selectedRel);
				setSelectedRel({});
			}
		}

		if (errors) {
			console.log('update error after called to doRequest');
			console.log(errors);
			setSubmitError(true);
			setAlertTitle('Unexpected error');
			setSubErrorReason(`An unexpected error occurred - please retry`);
		}
		setOpenSingleRelDialog(false);
	};

	const handleAddSingleDsRel = async () => {
		console.log(selectedDsRel);
		setSubmitError(false);
		url =
			process.env.NEXT_PUBLIC_SH_API_BASEURL + '/users/profileDsRelationship';
		url = `${url}?relationshipId=${selectedDsRel.id}&profileId=${userDetails.id}`;
		const data = await doRequest({
			url,
		});
		if (data) {
			console.log('update okay');
			console.log(data);
			const { status, message } = data;
			if (status === 'ERROR') {
				if (message.startsWith('duplicate key')) {
					setSubmitError(true);
					setAlertTitle('Duplicate relationship');
					setSubErrorReason(
						`You already have this relationship - please choose another`
					);
				}
			} else {
				console.log('call ');
				updateDsRelationships(selectedDsRel);
				setSelectedDsRel({});
				setOpenSingleDsRelDialog(false);
			}
		}
	};

	const handleDsDelRel = async (id) => {
		setSubmitError(false);
		url = url.replace('profileRelationship', 'profileDsRelationship');
		url = `${url}?relationshipId=${id}&profileId=${userDetails.id}`;
		const data = await doRequest({
			method: 'DELETE',
			url,
		});
		if (data) {
			const { status, message } = data;
			if (status === 'ERROR') {
				setSubmitError(true);
				setAlertTitle('Delete D/s relationship issue');
				setSubErrorReason(
					`Could not delete the relationship - please come back to the page and try again `
				);
			} else {
				deleteDsRelationship(id);
				setSelectedRel({});
				onDsRelationshipChange();
			}
		}
		if (errors) {
			console.log('update error after called to doRequest');
			console.log(errors);
			setSubmitError(true);
			setAlertTitle('Unexpected error');
			setSubErrorReason(`An unexpected error occurred - please retry`);
		}
	};
	const handleDelRel = async (id) => {
		setSubmitError(false);
		url = `${url}?relationshipId=${id}&profileId=${userDetails.id}`;

		const data = await doRequest({
			method: 'DELETE',
			url,
		});

		if (data) {
			console.log('update okay');
			console.log(data);
			const { status, message } = data;
			if (status === 'ERROR') {
				//if (message.startsWith('duplicate key')) {
				setSubmitError(true);
				setAlertTitle('Delete relationship issue');
				setSubErrorReason(
					`Could not delete the relationship - please come back to the page and try again `
				);
				//	}
			} else {
				deleteRelationship(id);
				setSelectedRel({});
				onRelationshipChange();
			}
		}

		if (errors) {
			console.log('update error after called to doRequest');
			console.log(errors);
			setSubmitError(true);
			setAlertTitle('Unexpected error');
			setSubErrorReason(`An unexpected error occurred - please retry`);
		}
	};

	const handleAddJointRel = () => {
		setOpenSingleRelDialog(false);
	};

	const currentRelationships = () => {
		console.log('userRelationships');
		console.log(userRelationships);
		if (userRelationships && userRelationships.length === 0) {
			return (
				<ListItem key="none">
					<ListItemText
						primary={
							<Typography style={{ fontWeight: 400 }}>
								You don&apos;t have any relationships
							</Typography>
						}
					/>
				</ListItem>
			);
		} else {
			return userRelationships &&
            userRelationships
                .filter((el) => el.id)
                .map((el) => (
                    <ListItem key={el.id}>
                        <ListItemText
                            primary={
                                <Typography style={{ fontWeight: 400 }}>
                                    {el.relationship}
                                </Typography>
                            }
                        />
                        <ListItemSecondaryAction>
                            <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={(e, id = el.id) => handleDelRel(id)}
                                size="large">
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ));
		}
	};
	const userCurrentDsRelationships = () => {
		console.log('userCurrentDsRelationships');
		console.log(userDsRelationships);
		if (userDsRelationships.length === 0) {
			return (
				<ListItem key="none">
					<ListItemText
						primary={
							<Typography style={{ fontWeight: 400 }}>
								You don&apos;t have any D/s relationships
							</Typography>
						}
					/>
				</ListItem>
			);
		} else {
			return userDsRelationships
				.filter((el) => el.id)
				.map((el) => (
					<ListItem key={el.id}>
						<ListItemText
							primary={
								<Typography style={{ fontWeight: 400 }}>
									{el.relationship}
								</Typography>
							}
						/>
						<ListItemSecondaryAction>
							<IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={(e, id = el.id) => handleDsDelRel(id)}
                                size="large">
								<DeleteIcon />
							</IconButton>
						</ListItemSecondaryAction>
					</ListItem>
				));
		}
	};

	return <>
        {console.log(userRelationships)}
        <Grid container direction="column" justifyContent="center">
            <Grid item container direction="row">
                {/* vanilla relationships */}
                <Grid item md={8}>
                    {/* List of current relationships   */}
                    <Grid
                        item
                        container
                        direction="row"
                        alignItems="flex-end"
                        justifyContent="center">
                        <Card className={classes.card}>
                            <CardHeader title="My relationships" />

                            <CardContent className={classes.details}>
                                <List>{currentRelationships()}</List>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <Grid item>
                    {/* List of current relationships   */}

                    <Card className={classes.card}>
                        <CardHeader title="Add relationship" />
                        <CardContent className={classes.details}>
                            {console.log('Relationship')}
                            {console.log(relationships)}

                            <Autocomplete
                                options={relationships}
                                getOptionLabel={(option) => {
                                    if (!option) {
                                        return '';
                                    }
                                    if (Object.keys(option).length === 0) {
                                        return '';
                                    }
                                    return option.relationship;
                                }}
                                isOptionEqualToValue={(option) => {
                                    if (Object.keys(option).length !== 0) {
                                        return option;
                                    } else return '';
                                }}
                                //value={selectedRel}
                                onChange={onRelationshipChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        label="Relationship"
                                        placeholder="select new relationship"
                                        margin="normal"
                                        fullWidth
                                    />
                                )}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Grid item container direction="row" style={{ marginTop: '30px' }}>
                {/* DS  relationships */}
                <Grid item md={8}>
                    {/* User selected DS relationships */}
                    {/* List of current relationships   */}
                    <Grid
                        item
                        container
                        direction="row"
                        alignItems="flex-end"
                        justifyContent="center">
                        <Card className={classes.card}>
                            <CardHeader title="My D/s relationships" />

                            <CardContent className={classes.details}>
                                <List style={{ maxHeight: 180, overflow: 'auto' }}>
                                    {userCurrentDsRelationships()}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <Grid item>
                    {/* Available DS relationships*/}
                    <Card className={classes.card}>
                        <CardHeader title="Available DS relationships" />
                        <CardContent className={classes.details}>
                            <Autocomplete
                                options={dsRelationships}
                                getOptionLabel={(option) => {
                                    if (!option) {
                                        return '';
                                    }
                                    if (Object.keys(option).length === 0) {
                                        return '';
                                    }
                                    return option.relationship;
                                }}
                                isOptionEqualToValue={(option) => {
                                    if (Object.keys(option).length !== 0) {
                                        return option;
                                    } else return '';
                                }}
                                //value={selectedRel}
                                onChange={onDsRelationshipChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        label="D/s Relationship"
                                        placeholder="select new relationship"
                                        margin="normal"
                                        fullWidth
                                    />
                                )}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
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
        </Grid>

        {/* Relationsship Single party dialog */}
        <Dialog
            onClose={(escapeKeyDown, backdropClick) => null}
            maxWidth="xs"
            open={openSingleRelDialog}
            aria-labelledby="single-rel-dialog-title">
            <DialogTitle id="single-rel-dialog-title">
                My new relationship
            </DialogTitle>
            <DialogContent dividers>
                <Typography>
                    Add <strong>{selectedRel.relationship}</strong> to my relationships
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    className={classes.button}
                    variant="contained"
                    size="medium"
                    color="primary"
                    type="button"
                    onClick={handleAddSingleRel}>
                    Yea, add
                </Button>
                <Button
                    className={classes.button}
                    variant="contained"
                    size="medium"
                    color="secondary"
                    type="button"
                    onClick={handleCloseSingleDlg}>
                    No thanks
                </Button>
            </DialogActions>
        </Dialog>

        {/* Joint party dialog */}
        <Dialog
            onClose={(escapeKeyDown, backdropClick) => null}
            disableEscapeKeyDown
            maxWidth="xs"
            open={openJointRelDialog}
            aria-labelledby="single-rel-dialog-title">
            <DialogTitle id="single-rel-dialog-title">
                My new relationship
            </DialogTitle>
            <DialogContent dividers>
                <Typography>
                    Add <strong>{selectedRel.relationship}</strong> to my relationships
                </Typography>
                Friends
            </DialogContent>
            <DialogActions>
                <Button
                    className={classes.button}
                    variant="contained"
                    size="medium"
                    color="primary"
                    type="button"
                    onClick={handleAddJointRel}>
                    Yea, add
                </Button>
                <Button
                    className={classes.button}
                    variant="contained"
                    size="medium"
                    color="secondary"
                    type="button"
                    onClick={handleCloseJointDlg}>
                    No thanks
                </Button>
            </DialogActions>
        </Dialog>

        {/* D/s Relationsship Single party dialog */}
        <Dialog
            onClose={(escapeKeyDown, backdropClick) => null}
            maxWidth="xs"
            open={openSingleDsRelDialog}
            aria-labelledby="single-rel-dialog-title">
            <DialogTitle id="single-rel-dialog-title">
                My new D/s relationship
            </DialogTitle>
            <DialogContent dividers>
                <Typography>
                    Add <strong>{selectedDsRel.relationship}</strong> to my D/s
                    relationships
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    className={classes.button}
                    variant="contained"
                    size="medium"
                    color="primary"
                    type="button"
                    onClick={handleAddSingleDsRel}>
                    Yea, add
                </Button>
                <Button
                    className={classes.button}
                    variant="contained"
                    size="medium"
                    color="secondary"
                    type="button"
                    onClick={handleCloseSingleDsDlg}>
                    No thanks
                </Button>
            </DialogActions>
        </Dialog>
    </>;
}

export default ProfileRelationShips;
