import { Card, CardContent, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import useMediaQuery from '@mui/material/useMediaQuery';

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

const EventNearBy = (props) => {
	const classes = useStyles();
	const theme = useTheme();
	const matchesSm = useMediaQuery(theme.breakpoints.down('md'));

	return (
		<Grid container direction="column" justifyContent="center">
			<Grid
				item
				container
				direction="row"
				alignItems="flex-start"
				justifyContent="center">
				<Card className={classes.card}>
					<CardContent className={classes.details}>Event nearby</CardContent>
				</Card>
			</Grid>
		</Grid>
	);
};

export default EventNearBy;
