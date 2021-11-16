import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { signIn, useSession } from 'next-auth/client';
import { useEffect } from 'react';
import React, { Fragment } from 'react';
import { ShiButton, ShiButtonAction } from 'src/components/ui/Button';

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

const Index = () => {
	const classes = useStyles();
	const theme = useTheme();
	const matchesSM = useMediaQuery(theme.breakpoints.down('sm'));
	const matchesXS = useMediaQuery(theme.breakpoints.down('xs'));
	// const dispatch = useDispatch();
	// useEffect(() => {
	// 	dispatch(startClock());
	// }, [dispatch]);
	const [session, loading] = useSession();
	return (
		<div>
			{/* <Image src="/images/main.jpg" layout="fill" objectFit="cover" /> */}
			<Grid
				container
				direction="column"
				justifyContent="center"
				className={classes.contentMain}>
				<Grid container direction="row" alignContent="center">
					<Grid container direction="column" item sm>
						<Grid
							item
							className={classes.signupContainer}
							container
							direction="column"
							alignItems="flex-start">
							<Grid item>
								<ShiButton path="/auth/signup" text="Sign up" size="large" />
							</Grid>
						</Grid>
					</Grid>
					<Grid container direction="column" item md align="center">
						<Grid
							item
							container
							className={classes.heroConatainer}
							display="flex"
							justifyContent="center">
							<Card className={classes.card} variant="outlined">
								<CardHeader title="ShibariLife - for your Shibari life!!" />

								<CardContent>
									<Typography variant="body1" color="textPrimary">
										Find your partner, chat, organize events, munches and more!!
									</Typography>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
					<Grid
						container
						direction="column"
						item
						md
						style={{ marginRight: '1em' }}>
						<Grid
							item
							container
							direction="column"
							alignItems="flex-end"
							className={classes.signinContainer}>
							{
								// <Button
								// 	size="large"
								// 	variant="contained"
								// 	color={colour}
								// 	width={900}
								// 	className={classes.button}>
								// 	{text}
								// 	onClick=
								// 	{() => {
								// 		e.preventDefault();
								// 		signIn();
								// 	}}
								// </Button>
								<ShiButtonAction
									//path="/api/auth/signin"
									text="Sign in"
									size="large"
									onClick={(e) => {
										e.preventDefault();
										signIn();
									}}
								/>
								// <a
								// 	href={`/api/auth/signin`}
								// 	className={classes.button}
								// 	onClick={(e) => {
								// 		e.preventDefault();
								// 		signIn();
								// 	}}>
								// 	Sign in
								// </a>
							}
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			{/* 
			<Grid
				container
				direction="column"
				justifyContent="center"
				className={classes.contentMain}>
				<Grid item>
					<Grid container direction="row">
						<Grid item className={classes.itemLeft}>
							<ShiButton path="/auth/signup" text="Sign up" size="large" />
						</Grid>
						<Grid item className={classes.heroBlock}>
							<Card className={classes.card} variant="outlined">
								<CardHeader title="ShibariLife - for your Shibari life!!" />

								<CardContent>
									<Typography variant="body1" color="textPrimary">
										Find your partner, chat, organize events, munches and more!!
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid
							item
							className={classes.itemRight}
							style={{ display: 'flex', justifyContent: 'flex-end' }}>
							<Grid>
								<ShiButton path="/auth/signin" text="Sign in" size="large" />
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			*/}
		</div>
	);
};

export default Index;
