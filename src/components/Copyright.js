import MuiLink from '@mui/material/Link';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import React from 'react';

const useStyles = makeStyles((theme) => ({
	textSecondary: {
		colour: theme.palette.common.shibariWhite,
	},
}));

export default function Copyright() {
	const classes = useStyles();
	return (
		<Typography className={classes.textSecondary} variant="h5" align="center">
			{'Copyright © '}
			<MuiLink color="inherit" href="https://shibari-life.com/">
				Shibari Life
			</MuiLink>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}
