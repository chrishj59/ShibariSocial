import '../components/css/app.css';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { Provider } from 'next-auth/client';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import Header from 'src/components/ui/Header';
import theme from 'src/components/ui/Theme';

//import '/css/app.css';

ReactGA.initialize('UA-154916062-1');

// Use the <Provider> to improve performance and allow components that call
// `useSession()` anywhere in your application to access the `session` object.
export default function App({ Component, pageProps }) {
	const [value, setCurrValue] = useState(0);
	const [selectedIndex, setCurrSelectedIndex] = useState(0);
	const [user, setUser] = useState({});

	//const theme = createMuiTheme();
	const useStyles = makeStyles((theme) => {
		root: {
			// some CSS that access to theme
		}
	});
	useEffect(() => {
		// Remove the server-side injected CSS.
		const jssStyles = document.querySelector('#jss-server-side');
		if (jssStyles) {
			jssStyles.parentElement.removeChild(jssStyles);
		}
		//	console.log(`app session ${session}`);
	}, []);
	const setValue = (index) => {
		setCurrValue(index);
	};

	const setSelectedIndex = (index) => {
		setCurrSelectedIndex(index);
	};
	return <>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Head>
                <title>Shibari Life</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>
            <div className="app">
                <Provider
                    // Provider options are not required but can be useful in situations where
                    // you have a short session maxAge time. Shown here with default values.
                    options={{
                        // Client Max Age controls how often the useSession in the client should
                        // contact the server to sync the session state. Value in seconds.
                        // e.g.
                        // * 0  - Disabled (always use cache value)
                        // * 60 - Sync session state with server if it's older than 60 seconds
                        clientMaxAge: 0,
                        // Keep Alive tells windows / tabs that are signed in to keep sending
                        // a keep alive request (which extends the current session expiry) to
                        // prevent sessions in open windows from expiring. Value in seconds.
                        //
                        // Note: If a session has expired when keep alive is triggered, all open
                        // windows / tabs will be updated to reflect the user is signed out.
                        keepAlive: 0,
                    }}
                    session={pageProps.session}>
                    <StyledEngineProvider injectFirst>
                        <ThemeProvider theme={theme}>
							<CssBaseline />
							<Header
								value={value}
								setValue={setValue}
								selectedIndex={setSelectedIndex}
								setSelectedIndex={setCurrSelectedIndex}
							/>
							<section className="body">
								<Component {...pageProps} />
							</section>
						</ThemeProvider>
                    </StyledEngineProvider>
                </Provider>
            </div>
        </LocalizationProvider>
    </>;
}
