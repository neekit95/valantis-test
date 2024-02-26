import React from 'react';

const NotFoundPage = () => {
	return (
		<div style={{
			minWidth: '100vw',
			minHeight: '100vh',
			display: 'flex',
			flexDirection:"column",
			justifyContent: 'center',
			alignItems: 'center',
			fontSize: '44px'
		}}>
			<p>
				Page not found!
			</p>
			<br/>
			<p>
				Error 404.
			</p>

		</div>
	);
};

export default NotFoundPage;
