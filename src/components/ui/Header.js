import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Collapse from '@material-ui/core/Collapse';
import Grow from '@material-ui/core/Grow';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { useTheme } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import MenuIcon from '@material-ui/icons/Menu';
import PersonIcon from '@material-ui/icons/Person';
import { makeStyles } from '@material-ui/styles';
import { signOut, useSession } from 'next-auth/client';
import Router, { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import Link from './Link';

//import useUser from 'lib/useUser';
function ElevationScroll(props) {
	const { children } = props;

	const trigger = useScrollTrigger({
		disableHysteresis: true,
		threshold: 0,
	});

	return React.cloneElement(children, {
		elevation: trigger ? 4 : 0,
	});
}
const useStyles = makeStyles((theme) => ({
	toolbarMargin: {
		...theme.mixins.toolbar,
		marginBottom: '3em',
		[theme.breakpoints.down('md')]: {
			marginBottom: '2em',
		},
		[theme.breakpoints.down('xs')]: {
			marginBottom: '1.25em',
		},
	},
	logo: {
		height: '8em',
		textTransform: 'none',
		[theme.breakpoints.down('md')]: {
			height: '7em',
		},
		[theme.breakpoints.down('xs')]: {
			height: '5.5em',
		},
	},
	logoContainer: {
		padding: 0,
		'&:hover': {
			backgroundColor: 'transparent',
		},
	},
	tabContainer: {
		marginLeft: 'auto',
	},
	tab: {
		...theme.typography.tab,
		minWidth: 10,
		marginLeft: '25px',
	},
	button: {
		...theme.typography.estimate,
		borderRadius: '50px',
		marginLeft: '50px',
		marginRight: '25px',
		height: '45px',
		'&:hover': {
			backgroundColor: theme.palette.secondary.light,
		},
	},
	menu: {
		// backgroundColor: theme.palette.common.blue,
		backgroundColor: theme.palette.common.purple,
		color: 'white',
		borderRadius: '0px',
		zIndex: 1302,
	},
	menuItem: {
		...theme.typography.tab,
		opacity: 0.7,
		'&:hover': {
			opacity: 1,
		},
	},
	drawerIcon: {
		height: '50px',
		width: '50px',
	},
	drawerIconContainer: {
		marginLeft: 'auto',
		'&:hover': {
			backgroundColor: 'transparent',
		},
	},
	drawer: {
		backgroundColor: theme.palette.common.blue,
	},
	drawerItem: {
		...theme.typography.tab,
		color: 'white',
		opacity: 0.7,
	},
	drawerItemEstimate: {
		backgroundColor: theme.palette.common.orange,
	},
	drawerItemSelected: {
		'& .MuiListItemText-root': {
			opacity: 1,
		},
	},
	appbar: {
		zIndex: theme.zIndex.modal + 1,
	},
	expansion: {
		backgroundColor: theme.palette.common.blue,
		borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
		'&.Mui-expanded': {
			margin: 0,
			borderBottom: 0,
		},
		'&::before': {
			backgroundColor: 'rgba(0, 0, 0, 0)',
		},
	},
	expansionDetails: {
		padding: 0,
		backgroundColor: theme.palette.primary.light,
	},
	expansionSummary: {
		padding: '0 24px 0 16px',
		'&:hover': {
			backgroundColor: 'rgba(0, 0, 0, 0.08)',
		},
		backgroundColor: (props) =>
			props.value === 1 ? 'rgba(0, 0, 0, 0.14)' : 'inherit',
	},
}));
// const useStyles = makeStyles((theme) => ({
// 	toolbarMargin: {
// 		...theme.mixins.toolbar,
// 		marginBottom: '3em',
// 		[theme.breakpoints.down('md')]: {
// 			marginBottom: '3em',
// 		},
// 		[theme.breakpoints.down('xs')]: {
// 			marginBottom: '1.25em',
// 		},
// 	},
// 	nested: {
// 		paddingLeft: theme.spacing(4),
// 	},
// 	logo: {
// 		height: '6em',
// 		textTransform: 'none',
// 		[theme.breakpoints.down('md')]: {
// 			height: '6em',
// 		},
// 		[theme.breakpoints.down('xs')]: {
// 			height: '5.5em',
// 		},
// 	},
// 	logoContainer: {
// 		padding: 0,
// 		'&:hover': {
// 			backgroundColor: 'transparent',
// 		},
// 	},
// 	tabContainer: {
// 		marginLeft: 'auto',
// 	},
// 	tab: {
// 		...theme.typography.tab,
// 		minWidth: 10,
// 		marginLeft: '25px',
// 	},
// 	button: {
// 		...theme.typography.estimate,
// 		borderRadius: '50px',
// 		marginLeft: '50px',
// 		marginRight: '25px',
// 		height: '45px',
// 		'&:hover': {
// 			backgroundColor: theme.palette.secondary.light,
// 		},
// 	},
// 	menu: {
// 		backgroundColor: theme.palette.common.purple,
// 		color: 'white',
// 		borderRadius: '0px',
// 		zIndex: 1302,
// 	},
// 	menuItem: {
// 		...theme.typography.tab,
// 		opacity: 0.7,
// 		'&:hover': {
// 			opacity: 1,
// 		},
// 	},
// 	drawerIcon: {
// 		height: '50px',
// 		width: '50px',
// 	},
// 	drawerIconContainer: {
// 		marginLeft: 'auto',
// 		'&:hover': {
// 			backgroundColor: 'transparent',
// 		},
// 	},
// 	drawer: {
// 		backgroundColor: theme.palette.common.purple,
// 	},
// 	drawerItem: {
// 		...theme.typography.tab,
// 		color: 'white',
// 		opacity: 0.7,
// 	},
// 	drawerItemNested: {
// 		...theme.typography.tab,
// 		color: theme.palette.common.peach,
// 		opacity: 0.7,
// 		paddingLeft: theme.spacing(2),
// 	},
// 	drawerItemEstimate: {
// 		backgroundColor: theme.palette.common.green,
// 	},
// 	drawerItemSelected: {
// 		'& .MuiListItemText-root': {
// 			opacity: 1,
// 		},
// 	},
// 	appbar: {
// 		zIndex: theme.zIndex.modal + 1,
// 	},
// 	expansion: {
// 		backgroundColor: theme.palette.common.purple,
// 		borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
// 		'&.Mui-expanded': {
// 			margin: 0,
// 			borderBottom: 0,
// 		},
// 		'&::before': {
// 			backgroundColor: 'rgba(0, 0, 0, 0)',
// 		},
// 	},
// 	expansionDetails: {
// 		padding: 0,
// 		backgroundColor: theme.palette.primary.light,
// 	},
// 	expansionSummary: {
// 		padding: '0 24px 0 16px',
// 		'&:hover': {
// 			backgroundColor: 'rgba(0, 0, 0, 0.08)',
// 		},
// 		backgroundColor: (props) =>
// 			props.value === 1 ? 'rgba(0, 0, 0, 0.14)' : 'inherit',
// 	},
// }));

//export default function Header(props) {
const Header = (props) => {
	console.log('start Header');
	const [session, loading] = useSession();
	if (loading) return null;

	const classes = useStyles(props);
	const theme = useTheme();
	const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);
	const matchesMd = useMediaQuery(theme.breakpoints.down('md'));
	const [drawerPersonOpen, setdrawerPersonOpen] = React.useState(true);

	const [openDrawer, setOpenDrawer] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [openMenu, setOpenMenu] = useState(false);
	const [openProfileMenu, setOpenProfileMenu] = useState(false);
	//const { user, mutateUser } = useUser();

	const [loggedIn, setLoggedIn] = useState(false);

	const [previousURL, setPreviousURL] = useState('');

	//console.log(`header user: ${JSON.stringify(session)} `);
	const router = useRouter();

	const handleChange = (e, newValue) => {
		props.setValue(newValue);
	};

	const drawerPersonClick = () => {
		setdrawerPersonOpen(!drawerPersonOpen);
	};
	const handleClick = (e) => {
		setAnchorEl(e.currentTarget);
		setOpenMenu(true);
	};

	const handleProfileClick = (e) => {
		setAnchorEl(e.currentTarget);
		setOpenProfileMenu(true);
	};

	const handleMenuItemClick = (e, i) => {
		setAnchorEl(null);
		setOpenMenu(false);
		props.setSelectedIndex(i);
	};

	const handleClose = (e) => {
		setAnchorEl(null);
		setOpenMenu(false);
	};
	const handleProfileClose = (e) => {
		setAnchorEl(null);
		setOpenProfileMenu(false);
	};

	function handleListKeyDown(event) {
		if (event.key === 'Tab') {
			event.preventDefault();
			setOpen(false);
		}
	}
	function handleProfileListKeyDown(event) {
		if (event.key === 'Tab') {
			event.preventDefault();
			setOpenProfileMenu(false);
		}
	}

	const menuExploreOptions = [
		{
			name: 'Members',
			link: '/secure/members',
			activeIndex: 0,
			selectedIndex: 0,
		},
		{
			name: 'Media ',
			link: '/secure/media',
			activeIndex: 0,
			selectedIndex: 1,
		},
	];

	const menuProfileOptions = [
		{
			name: 'Log Out',
			link: '/auth/signout',
			activeIndex: 6,
			selectedIndex: 0,
		},
		{
			name: 'Profile',
			link: '/secure/user/profile',
			activeIndex: 6,
			selectedIndex: 1,
		},
		{
			name: 'Account',
			link: '/secure/account',
			activeIndex: 6,
			selectedIndex: 2,
		},
	];

	const routes = [
		{ name: 'Home', link: '/', activeIndex: 0, isDisabled: false },
		{
			name: 'Explore',
			link: '/secure/explore',
			activeIndex: 1,
			ariaOwns: anchorEl ? 'simple-menu' : undefined,
			ariaPopup: anchorEl ? 'true' : undefined,
			mouseOver: (event) => handleClick(event),
			isDisabled: !loggedIn,
		},
		{
			name: 'Groups',
			link: '/secure/groups',
			activeIndex: 2,
			isDisabled: !loggedIn,
		},
		{
			name: 'Events',
			link: '/secure/events/fetishEvent',
			activeIndex: 3,
			isDisabled: !loggedIn,
		},
		{
			name: 'Blogs',
			link: '/secure/blogs',
			activeIndex: 4,
			isDisabled: !loggedIn,
		},
		{
			name: 'Chat',
			link: '/secure/chat',
			activeIndex: 5,
			isDisabled: !loggedIn,
		},
		{ name: 'About Us', link: '/about', activIndex: 6, isDisabled: false },
	];

	function checkPath() {
		[...menuExploreOptions, ...routes].forEach((route) => {
			const secureRoute = window.location.pathname.startsWith('/secure/');
			if (secureRoute && !session) {
				console.log('redirect to login');
				router.push('/');
			}

			switch (window.location.pathname) {
				case `${route.link}`:
					if (props.value !== route.activeIndex) {
						props.setValue(route.activeIndex);
						if (
							route.selectedIndex &&
							route.selectedIndex !== props.selectedIndex
						) {
							props.setSelectedIndex(route.selectedIndex);
						}
					}
					break;
				case '/secure/explore':
					if (props.value !== false) {
						props.setValue(false);
					}

					break;
				default:
					break;
			}
		});
	}

	useEffect(() => {
		const secureRoute = window.location.pathname.startsWith('/secure/');

		// if (secureRoute && !session) {
		// 	router.push('/');
		// }
		// if (previousURL !== window.location.pathname) {
		// 	setPreviousURL(window.location.pathname);
		// 	ReactGA.pageview(window.location.pathname + window.location.search);
		// }

		if (window.performance) {
			if (performance.navigation.type == 1) {
				checkPath();
			}
		}
		if (session) {
			setLoggedIn(true);
		}
	}, [
		props.value,
		menuExploreOptions,
		openProfileMenu,
		props.selectedIndex,
		routes,
		props,
		// user,
		session,
	]);

	Router.events.on('routeChangeComplete', (url) => {
		checkPath();
	});

	const tabs = (
		<>
			{console.log(`tabs user loggedin ${loggedIn}`)}
			<Tabs
				value={props.value}
				onChange={handleChange}
				className={classes.tabContainer}
				indicatorColor="primary">
				{routes.map((route, index) => {
					return (
						<Tab
							key={`${route}${index}`}
							disabled={route.isDisabled}
							className={classes.tab}
							component={Link}
							href={route.link}
							label={route.name}
							aria-owns={route.ariaOwns}
							aria-haspopup={route.ariaPopup}
							onMouseOver={route.mouseOver}
							onMouseLeave={() => setOpenMenu(false)}
						/>
					);
				})}
			</Tabs>
			<IconButton
				variant="contained"
				color="secondary"
				fontSize="large"
				disabled={!loggedIn}
				aria-owns={anchorEl ? 'profile-menu' : undefined}
				aria-haspopup={anchorEl ? 'true' : undefined}
				onMouseOver={(event) => handleProfileClick(event)}>
				<PersonIcon fontSize="large" />
			</IconButton>
			<Popper
				open={openProfileMenu}
				anchorEl={anchorEl}
				placement="bottom-start"
				role={undefined}
				transition
				disablePortal>
				{({ TransitionProps, placement }) => (
					<Grow
						{...TransitionProps}
						style={{
							transformOrigin: 'top right',
						}}>
						<Paper classes={{ root: classes.menu }} elevation={0}>
							<ClickAwayListener onClickAway={handleProfileClose}>
								<MenuList
									onMouseOver={() => setOpenProfileMenu(true)}
									onMouseLeave={handleProfileClose}
									disablePadding
									autoFocusItem={false}
									id="profile-menu"
									onKeyDown={handleProfileListKeyDown}>
									{/*	<MenuItem
										onClick={async (e) => {
											e.preventDefault();
											console.log('MenuItem logout onClick');
											mutateUser(
												await fetchJson('/api/v1/auth/signout', {
													method: 'POST',
												}),
												false
											);
											setOpenProfileMenu(false);
											router.push('/auth/signin');
										}}>
										<Typography className={classes.menuItem}>
											Log out
										</Typography>
									</MenuItem> */}
									{menuProfileOptions.map((option, i) => (
										<MenuItem
											key={`${option}${i}`}
											component={Link}
											href={option.link}
											classes={{ root: classes.menuItem }}
											onClick={(event) => {
												handleMenuItemClick(event, i);
												props.setValue(1);
												handleProfileClose();
											}}
											selected={
												i === props.selectedIndex &&
												props.value === 1 &&
												window.location.pathname !== '/secure/Explore'
											}>
											{option.name}
										</MenuItem>
									))}
								</MenuList>
							</ClickAwayListener>
						</Paper>
					</Grow>
				)}
			</Popper>

			<Popper
				open={openMenu}
				anchorEl={anchorEl}
				placement="bottom-start"
				role={undefined}
				transition
				disablePortal>
				{({ TransitionProps, placement }) => (
					<Grow
						{...TransitionProps}
						style={{
							transformOrigin: 'top left',
						}}>
						<Paper classes={{ root: classes.menu }} elevation={0}>
							<ClickAwayListener onClickAway={handleClose}>
								<MenuList
									onMouseOver={() => setOpenMenu(true)}
									onMouseLeave={handleClose}
									disablePadding
									autoFocusItem={false}
									id="simple-menu"
									onKeyDown={handleListKeyDown}>
									{menuExploreOptions.map((option, i) => (
										<MenuItem
											key={`${option}${i}`}
											component={Link}
											href={option.link}
											classes={{ root: classes.menuItem }}
											onClick={(event) => {
												handleMenuItemClick(event, i);
												props.setValue(1);
												handleClose();
											}}
											selected={
												i === props.selectedIndex &&
												props.value === 1 &&
												window.location.pathname !== '/secure/Explore'
											}>
											{option.name}
										</MenuItem>
									))}
								</MenuList>
							</ClickAwayListener>
						</Paper>
					</Grow>
				)}
			</Popper>
		</>
	);

	const drawer = (
		<>
			<SwipeableDrawer
				disableBackdropTransition={!iOS}
				disableDiscovery={iOS}
				open={openDrawer}
				onClose={() => setOpenDrawer(false)}
				onOpen={() => setOpenDrawer(true)}
				classes={{ paper: classes.drawer }}>
				<div className={classes.toolbarMargin} />
				<List disablePadding>
					{routes.map((route) => (
						<ListItem
							divider
							key={`${route}${route.activeIndex}`}
							button
							component={Link}
							href={route.link}
							selected={props.value === route.activeIndex}
							classes={{ selected: classes.drawerItemSelected }}
							onClick={() => {
								setOpenDrawer(false);
								props.setValue(route.activeIndex);
							}}>
							<ListItemText className={classes.drawerItem} disableTypography>
								{route.name}
							</ListItemText>
						</ListItem>
					))}
					<ListItem divider key={'profile'} onClick={drawerPersonClick}>
						<ListItemIcon>
							<PersonIcon color="secondary" fontSize="large" />

							{!drawerPersonOpen ? (
								<ExpandLess colour="secondary" />
							) : (
								<ExpandMore colour="secondary" />
							)}
						</ListItemIcon>
					</ListItem>
					<Collapse in={!drawerPersonOpen} timeout="auto" unmountOnExit>
						<List component="div" disablePadding>
							<ListItem
								divider
								key={`logout`}
								button
								//component={Link}
								//href={`/api/auth/signout`}
								selected={props.value === 'logout'}
								classes={{ selected: classes.drawerItemSelected }}
								onClick={(e) => {
									signOut({ callbackUrl: '/' });
									// setOpenDrawer(false);
									// props.setValue(route.activeIndex);
								}}>
								<ListItemText
									className={classes.drawerItemNested}
									disableTypography>
									{'Log Out'}
								</ListItemText>
							</ListItem>
							<ListItem
								divider
								key={`Profile`}
								button
								component={Link}
								href={`/secure/profile`}
								selected={props.value === 'profile'}
								classes={{ selected: classes.drawerItemSelected }}
								onClick={() => {
									setOpenDrawer(false);
									props.setValue(route.activeIndex);
								}}>
								<ListItemText
									className={classes.drawerItemNested}
									disableTypography>
									{'Profile'}
								</ListItemText>
							</ListItem>
							<ListItem
								divider
								key={`account`}
								button
								component={Link}
								href={`/secure/account`}
								selected={props.value === 'account'}
								classes={{ selected: classes.drawerItemSelected }}
								onClick={() => {
									setOpenDrawer(false);
									props.setValue(route.activeIndex);
								}}>
								<ListItemText
									className={classes.drawerItemNested}
									disableTypography>
									{'Account'}
								</ListItemText>
							</ListItem>
						</List>
					</Collapse>
				</List>
			</SwipeableDrawer>
			<IconButton
				className={classes.drawerIconContainer}
				onClick={() => setOpenDrawer(!openDrawer)}
				disableRipple>
				<MenuIcon className={classes.drawerIcon} />
			</IconButton>
		</>
	);

	return (
		<>
			<header>
				<ElevationScroll>
					<AppBar position="fixed" className={classes.appbar}>
						<Toolbar disableGutters>
							<Button
								component={Link}
								href="/"
								disableRipple
								onClick={() => props.setValue(0)}
								className={classes.logoContainer}
								style={{ textDecoration: 'none' }}>
								<img
									src="/images/Gyaku_ebi_tie.svg"
									alt="Shibari Life logo"
									className={classes.logo}
								/>
							</Button>
							<Hidden smDown>{tabs}</Hidden>
							<Hidden mdUp>{drawer}</Hidden>
						</Toolbar>
					</AppBar>
				</ElevationScroll>
				<div className={classes.toolbarMargin} />
			</header>
		</>
	);
};

Header.getInitialProps = async (ctx) => {
	console.log('init props called');
};

export default Header;
