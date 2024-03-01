import React, {useState} from 'react';
import md5 from "md5";
import Card from '../../components/card/card'
import style from './homepage.module.scss'
const Homepage = () => {
	const [listOfID, setListOfID] = useState([]);
	const [offset, setOffset] = useState(0);
	const [limit, setLimit] = useState(50);

	const getCurrentDate = () => {
		const date = new Date();
		const year = date.getUTCFullYear();
		const month = (`0${date.getUTCMonth() + 1}`).slice(-2);
		const day = (`0${date.getUTCDate()}`).slice(-2);

		return `${year}${month}${day}`;
	};

	const handleClick = async () => {
		setListOfID([])
		try {
			const timestamp = getCurrentDate();
			const password = 'Valantis';
			const xAuth = md5(`${password}_${timestamp}`);

			const response = await fetch('http://api.valantis.store:40000/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Auth': xAuth,
				},
				body: JSON.stringify({
					action: 'get_ids',
					params: {
						offset: offset,
						limit: limit,
					},
				}),
			});

			const data = await response.json();
			console.log('data:', data);
			const result = data.result;
			console.log('result:', result);
			setListOfID(result);
		} catch (error) {
			console.error('Error:', error);
		}
	};

	return (
		<div className={style.homepage}>

			<div className={style.cards}>
				{listOfID.map((item, index) => (
					<div key={index}>
						<Card id={item}/>
					</div>
				))}
			</div>


			<button
				onClick={handleClick}
			>
				fetch data
			</button>
		</div>
	);
};

export default Homepage;
