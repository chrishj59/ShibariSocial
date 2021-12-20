import Copyright from '@/src/Copyright';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';

const useStyles = makeStyles((theme) => ({
	footer: {
		color: 'white',
		fontWeight: 'bold',
	},
}));

export default function Footer(props) {
	const classes = useStyles();

	return (
		<footer className={classes.footer}>
			<Copyright />
		</footer>
	);
}
