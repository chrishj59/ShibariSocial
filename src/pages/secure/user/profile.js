import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import axios from 'axios';
import { getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { authCookieHeader } from 'src/utils/authReqHeader';

import ProfileFetish from './profile-fetish';
import ProfilePersonal from './profile-personal';
import ProfileRelationShips from './profile-relationships';

//import withSession from 'lib/session';
//import useUser from 'lib/useUser';
function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}>
			{value === index && <Box p={3}>{children}</Box>}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};

function a11yProps(index) {
	return {
		id: `nav-tab-${index}`,
		'aria-controls': `nav-tabpanel-${index}`,
	};
}

function LinkTab(props) {
	return (
		<Tab
			component="a"
			onClick={(event) => {
				event.preventDefault();
			}}
			{...props}
		/>
	);
}

const useStyles = makeStyles((theme) => ({
	tabRoot: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
	},
}));

const StyledTab = withStyles((theme) => ({
	root: {
		textTransform: 'none',
		color: theme.palette.common.blue,
		fontFamily: 'Roboto',
		fontWeight: theme.typography.fontWeightRegular,
		[theme.breakpoints.down('sm')]: {
			fontSize: theme.typography.pxToRem(20),
		},
		[theme.breakpoints.up('sm')]: {
			fontSize: theme.typography.pxToRem(30),
		},
		marginRight: theme.spacing(1),
		'&:focus': {
			opacity: 1,
		},
	},
}))((props) => <Tab disableRipple {...props} />);

function NavTabs(props) {
	const {
		titles,
		genders,
		pronouns,
		orientations,
		counties,
		profile,
		relationships,
		session,
		dsRelationships,
		config,
		fetishes,
	} = props;
	//const { user, mutateUser } = useUser();
	const classes = useStyles();
	const [value, setValue] = useState(0);
	const [loginId, setUserId] = useState('');
	const [userRelationships, setUserRelationships] = useState([]);
	const [userDsRelationships, setUserDsRelationships] = useState([]);
	const [userFetishes, setUserFetishes] = useState([]);
	const [userDetails, setUserDetails] = useState({});
	const router = useRouter();

	useEffect(() => {
		console.log('use effect on profile or userdetais');
		console.log(profile);
		if (profile.relationships) {
			setUserRelationships(profile.relationships);
		}
		if (profile.dsrelationships) {
			setUserDsRelationships(profile.dsrelationships);
		}
		setUserDetails(profile);
		setUserFetishes(profile.fetishMaps);
		console.log(userDetails);
		console.log(userFetishes);
	}, []);

	const refreshData = () => {
		router.replace(router.asPath);
	};

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const updateUserDetails = async (newUserDetails) => {
		setUserDetails(newUserDetails);
	};

	const compareRelationships = (a, b) => {
		const relationshipA = a.relationship.toUpperCase();
		const relationshipB = b.relationship.toUpperCase();
		console.log(
			`relationshipA: ${relationshipA} relationshipB: ${relationshipB}`
		);
		let comparison = 0;
		if (relationshipA > relationshipB) {
			comparison = 1;
		} else if (relationshipA < relationshipB) {
			comparison = -1;
		}
		console.log('return comparison:', comparison);
		return comparison;
	};

	const updateRelationships = (newRelationship) => {
		const numRel = userRelationships.length;
		let _userRelationships = userRelationships;
		_userRelationships[numRel] = newRelationship;
		_userRelationships.sort(compareRelationships);

		setUserRelationships(_userRelationships);

		console.log('relationships after push');
		console.log(userRelationships);
		//refreshData();
	};

	const updateDsRelationships = (newRelationship) => {
		const numRel = userRelationships.length;
		let _userDsRelationships = userDsRelationships;
		_userDsRelationships[numRel] = newRelationship;
		_userDsRelationships.sort(compareRelationships);
		setUserDsRelationships(_userDsRelationships);
	};

	const deleteDsRelationship = async (relId) => {
		const _userDsRelationships = userDsRelationships;
		const idx = _userDsRelationships.findIndex((rel) => rel.id === relId);
		_userDsRelationships.splice(idx, 1);
		setUserDsRelationships(_userDsRelationships);
		console.log(`DsRelationships after delete ${userDsRelationships.length}`);
	};
	const deleteRelationship = async (relId) => {
		const _userRelationships = userRelationships;
		const idx = _userRelationships.findIndex((rel) => rel.id === relId);

		_userRelationships.splice(idx, 1);
		setUserRelationships(_userRelationships);

		console.log('relationships after del');
	};

	const addProfileFetish = (newProfileFetish) => {
		console.log(
			`Profile addProfileFetish received ${JSON.stringify(newProfileFetish)}`
		);
		console.log(`userFetishes: ${JSON.stringify(userFetishes)}`);
		const numFet = userFetishes.length;
		console.log(`numFet ${numFet}`);
		const updatedFetish = userFetishes;
		updatedFetish[numFet] = newProfileFetish;
		setUserFetishes(updatedFetish);
		console.log(
			`end of addProfileFetish userFetsies ${JSON.stringify(updatedFetish)}`
		);
	};

	const deleteUserFetish = (profileFetishId) => {
		const updatedList = userFetishes.filter(
			(item) => item.id !== profileFetishId
		);
		setUserFetishes(updatedList);
	};
	// console.log('user');
	// console.log(user && user.loginId);
	if (!userDetails) {
		return null;
	}
	return (
		<>
			<Grid
				container
				direction="row"
				justifyContent="center"
				alignItems="center">
				<Tabs
					variant={'standard'}
					value={value}
					onChange={handleChange}
					textColor="secondary"
					aria-label="nav tabs example">
					<StyledTab label="Personal" {...a11yProps(0)} />
					<StyledTab label="Relationship" {...a11yProps(1)} />
					<StyledTab label="Fetishes" {...a11yProps(2)} />
				</Tabs>
			</Grid>

			<TabPanel value={value} index={0}>
				{console.log('before call Profile Personal')}
				{console.log(userDetails)}
				<ProfilePersonal
					//loginId={user && user.loginId}
					titles={titles}
					genders={genders}
					pronouns={pronouns}
					orientations={orientations}
					counties={counties}
					profile={profile}
					userDetails={userDetails}
					updateUserDetails={updateUserDetails}
					session={session}
				/>
			</TabPanel>
			<TabPanel value={value} index={1}>
				<ProfileRelationShips
					//loginId={user && user.loginId}
					session={session}
					relationships={relationships}
					userDetails={userDetails}
					userRelationships={userRelationships}
					updateRelationships={updateRelationships}
					updateDsRelationships={updateDsRelationships}
					deleteRelationship={deleteRelationship}
					dsRelationships={dsRelationships}
					deleteDsRelationship={deleteDsRelationship}
					userDsRelationships={userDsRelationships}
				/>
			</TabPanel>

			<TabPanel value={value} index={2}>
				<ProfileFetish
					session={session}
					fetishes={fetishes}
					userFetishes={userFetishes}
					deleteUserFetish={deleteUserFetish}
					addProfileFetish={addProfileFetish}
					userDetails={userDetails}
				/>
			</TabPanel>
		</>
	);
}

export const getServerSideProps = async function (context) {
	console.log('server side props');
	const { req, res } = context;
	const session = await getSession(context);

	if (!session) {
		console.log('Profile no props');
		res.setHeader('location', '/');
		res.statusCode = 401;
		res.end();
		return { props: {} };
	}

	const config = authCookieHeader(session);
	let profile = {};
	let hasFriends = false;

	if (session) {
		try {
			const resp = await axios.get(
				process.env.SH_API_BASEURL + `/users/profileRelations`,
				config
			);
			if (typeof resp.data === 'string' || resp.data instanceof String) {
				profile = {};
			} else {
				profile = resp.data;

				hasFriends = profile.friends > 0 ? true : false;
				profile.hasFriends = hasFriends;
			}
			console.log(`hasFriends ${hasFriends}`);
		} catch (err) {
			console.log(err);
		}
	}
	const { data: genders } = await axios.get(
		process.env.SH_API_BASEURL + '/users/gender'
	);
	const { data: titles } = await axios.get(
		process.env.SH_API_BASEURL + '/users/title'
	);
	const { data: pronouns } = await axios.get(
		process.env.SH_API_BASEURL + '/users/pronoun'
	);

	const { data: orientations } = await axios.get(
		process.env.SH_API_BASEURL + '/users/orientation'
	);

	const { data: counties } = await axios.get(
		process.env.SH_API_BASEURL + '/place/ukCounty'
	);
	let { data: relationships } = await axios.get(
		process.env.SH_API_BASEURL + '/users/relationship'
	);

	let { data: dsRelationships } = await axios.get(
		process.env.SH_API_BASEURL +
			`/users/dsRelationship?hasOtherPerson=${hasFriends}`
	);

	console.log(`ProfileFriends ${profile.friendsCount}`);
	if (profile.friendsCount < 1) {
		relationships = relationships.filter((r) => !r.hasOtherPerson);
	}

	let { data: fetishes } = await axios.get(
		process.env.SH_API_BASEURL + `/users/fetish`
	);

	return {
		props: {
			titles,
			genders,
			pronouns,
			orientations,
			counties,
			profile,
			relationships,
			dsRelationships,
			session,
			config,
			fetishes,
		},
	};
};

export default NavTabs;
