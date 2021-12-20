import { Typography } from '@mui/material';
import React from 'react';

const Home = (props) => {
	console.log(props);
	//const { user } = useUser({ redirectTo: '/' });
	//console.log(user);

	return (
		<div>
			<Typography variant="h1" style={{ color: 'white' }}>
				home page
			</Typography>{' '}
		</div>
	);
};

export default Home;
