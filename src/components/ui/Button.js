import Button from '@mui/material/Button';
import makeStyles from '@mui/styles/makeStyles';
import Link from 'next/link';
import React from 'react';

const useStyles = makeStyles((theme) => ({
	roundedButton: {
		borderRadius: 25,
	},
	buttonText: {
		colour: theme.palette.common.shibariWhite,
	},
	button: {
		...theme.typography.landingButton,
		borderRadius: '50px',
		padding: '32px 70px',
		fontSize: '1.15rem',
		'&:hover': {
			backgroundColor: theme.palette.primary.light,
		},
	},
}));

export function ShiButton(props) {
	const classes = useStyles();

	const {
		path,
		text,
		colour = 'primary',
		variant = 'contained',
		size = 'large',
		onClick,
	} = props;
	return (
		<Link href={path} passHref>
			<Button
				size={size}
				variant={variant}
				color={colour}
				width={900}
				className={classes.button}>
				{text}
			</Button>
		</Link>
	);
}

export function ShiButtonAction(props) {
	const classes = useStyles();

	const {
		text,
		colour = 'primary',
		variant = 'contained',
		size,
		width = 900,
		onClick,
	} = props;
	return (
		// <Link href={path} passHref>
		<Button
			size={size}
			variant={variant}
			color={colour}
			width={width}
			className={classes.button}
			onClick={onClick}>
			{text}
		</Button>
		// </Link>
	);
}

// export function ListItem(path, onclick, text) {
// 	return (
// 		<List href={path} passHref>
// 			<LinkItem button component="a" onClick={onclick}>
// 				<ListItemText>{text}</ListItemText>
// 			</LinkItem>
// 		</List>
// 	);
// }
