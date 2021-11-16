import Copyright from '@/src/Copyright';
import { makeStyles } from '@material-ui/core/styles';
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
