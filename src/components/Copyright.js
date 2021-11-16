import MuiLink from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
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
