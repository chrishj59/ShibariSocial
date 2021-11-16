import { createTheme } from '@material-ui/core/styles';

const shibariRed = '#f44336';
const shibariBlue = '#36e7f4';
const shibariPurple = '#A236F4';
const shibariGrey = '#BCB1B4';
const shibariWhite = '#FFFFFF';
const shibariBlack = '#222121';
const shibariPeach = '#FCF2F2';
const shibariGreen = '#88F436';
const shibariOrange = '#F4A236';

export default createTheme({
	palette: {
		common: {
			blue: shibariBlue,
			red: shibariRed,
			purple: shibariPurple,
			grey: shibariGrey,
			white: shibariWhite,
			black: shibariBlack,
			peach: shibariPeach,
			green: shibariGreen,
			orange: shibariOrange,
		},
		primary: {
			main: shibariPurple,
		},
		secondary: {
			main: shibariGreen,
		},
		text: {
			primary: shibariPurple,
		},
	},
	typography: {
		tab: {
			fontFamily: 'Raleway',
			textTransform: 'none',
			fontWeight: 700,
			color: 'white',
			fontSize: '1rem',
		},
		estimate: {
			fontFamily: 'Pacifico',
			fontSize: '1rem',
			textTransform: 'none',
			color: 'white',
		},
		landingButton: {
			fontFamily: 'Raleway',
			fontSize: '1rem',
			fontWeight: 700,
			textTransform: 'none',
			color: shibariWhite,
		},
		h1: {
			fontFamily: 'Raleway',
			fontWeight: 700,
			fontSize: '2.5rem',
			lineHeight: 1.5,
		},
		h3: {
			fontFamily: 'Raleway',
		},
		h4: {
			fontFamily: 'Raleway',
			fontSize: '1.75rem',
			color: shibariOrange,
			fontWeight: 700,
		},
		h6: {
			fontWeight: 500,
			fontFamily: 'Raleway',
			color: shibariPurple,
		},
		subtitle1: {
			fontSize: '1.25rem',
			fontWeight: 300,
			color: shibariGrey,
		},
		subtitle2: {
			color: 'white',
			fontWeight: 300,
			fontSize: '1.25rem',
		},
		button: {
			marginTop: '1em',
			fontFamily: 'Raleway',
			/*fontSize: "2.5rem", */
			color: shibariWhite,
			fontWeight: 700,
		},

		body1: {
			fontSize: '1.25rem',
			color: shibariGrey,
			fontWeight: 300,
		},
		caption: {
			fontSize: '1rem',
			fontWeight: 300,
			color: shibariGrey,
		},
		learnButton: {
			borderColor: shibariRed,
			borderWidth: 2,
			textTransform: 'none',
			color: shibariRed,
			borderRadius: 50,
			fontFamily: 'Roboto',
			fontWeight: 'bold',
		},
	},
	overrides: {
		MuiInputLabel: {
			root: {
				color: shibariOrange,
				fontSize: '1rem',
				fontWeight: 500,
			},
		},
		MuiInput: {
			root: {
				color: shibariPurple,
				fontWeight: 300,
			},
			underline: {
				'&:before': {
					borderBottom: `2px solid ${shibariOrange}`,
				},
				'&:hover:not($disabled):not($focused):not($error):before': {
					borderBottom: `2px solid ${shibariPurple}`,
				},
			},
		},
		MuiFormHelperText: {
			contained: {
				color: shibariRed,
				fontWeight: 400,
			},
		},
		MuiAlertTitle: {
			root: { color: shibariPurple, fontWeight: 700 },
		},
		MuiFormControlLabel: {
			label: {
				color: shibariPurple,
				fontSize: 14,
			},
		},
		MUIRichTextEditor: {
			root: {
				marginTop: 20,
			},
			editor: {
				borderBottom: '1px solid gray',
				maxHeight: '8rem',
				overflow: 'auto',
				// minHeight: '8rem',
			},
		},
	},
});
