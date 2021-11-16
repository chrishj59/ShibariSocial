import { Button, Card, CardContent, CardHeader, Grid, Typography } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { signOut } from 'next-auth/client';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => ({
	contentMain: {
		minHeight: '90vh',
	},
	signupContainer: {
		[theme.breakpoints.down('sm')]: {
			marginBottom: '1em',
			alignItems: 'center',
		},
		marginLeft: '1em',
	},
	signinContainer: {
		[theme.breakpoints.down('sm')]: {
			alignItems: 'center',
			marginRight: '1em',
		},
		marginRight: '1em',
	},
	heroConatainer: {
		minWidth: '30em',
	},
	itemLeft: {
		marginLeft: '30px',
	},
	itemRight: {
		marginRight: '30px',
	},
	card: {
		opacity: 0.85,
		borderRadius: '30px',
	},
	heroBlock: {
		marginRight: '1em',
		marginLeft: '1em',
	},
}));
const Signout = (props) => {
	const classes = useStyles();
	const theme = useTheme();
	const router = useRouter();

	return (
		<>
			<Grid
				container
				direction="column"
				justifyContent="center"
				className={classes.contentMain}>
				<Grid container direction="row" alignContent="center">
					<Grid container direction="column" item md align="center">
						<Grid
							item
							container
							className={classes.heroConatainer}
							display="flex"
							justifyContent="center">
							<Card className={classes.card} variant="outlined">
								<CardHeader title="Signing out of Shibari life?" />

								<CardContent>
									<Typography variant="body1" color="textPrimary">
										We are sorry to see you go. Come back soon!
									</Typography>
									<Button
										className={classes.button}
										variant="contained"
										size="medium"
										style={{ backgroundColor: theme.palette.common.orange }}
										type="submit"
										onClick={(e) => {
											e.preventDefault();
											signOut({ callbackUrl: '/' });
										}}>
										Sign out
									</Button>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</>
	);
};

export default Signout;
