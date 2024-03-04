import React, {useEffect, useState} from 'react';
import md5 from "md5";
import Card from '../../components/card/card'
import style from './homepage.module.scss'

const Homepage = () => {
	const [listOfID, setListOfID] = useState([]);
	const [offset, setOffset] = useState(0);
	const [limit, setLimit] = useState(50);
	const [listOfItems, setListOfItems] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [itemsLenght, setItemsLenght] = useState(0);

	const getCurrentDate = () => {
		const date = new Date();
		const year = date.getUTCFullYear();
		const month = (`0${date.getUTCMonth() + 1}`).slice(-2);
		const day = (`0${date.getUTCDate()}`).slice(-2);

		return `${year}${month}${day}`;
	};

	const fetchData = async () => {
		setIsLoading(true)
		try {
			const timestamp = getCurrentDate();
			const password = 'Valantis';
			const xAuth = md5(`${password}_${timestamp}`);

			const idsResponse = await fetch('http://api.valantis.store:40000/', {
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

			const idsData = await idsResponse.json();
			console.log('idsData:', idsData);

			const ids = idsData.result;
			console.log('ids:', ids);

			// добавить фильтр на дубликаты
			setListOfID(ids);

			const itemsResponse = await fetch('http://api.valantis.store:40000/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Auth': xAuth,
				},
				body: JSON.stringify({
					action: 'get_items',
					params: {
						'ids': ids
					},
				}),
			});

			const itemsData = await itemsResponse.json();

			const items = itemsData.result;

			setListOfItems(items);

		} catch (error) {
			console.error('Error:', error);
		}
		setIsLoading(false)
	};

	useEffect(() => {
		setItemsLenght(listOfItems.length)
	}, [listOfItems]);

	const handleClick = () => {
		setListOfID([])
		setListOfItems([]);
		console.clear();
		fetchData()
	}

	return (
		<div className={style.homepage}>
			<div className={style.container}>
				{isLoading ? <div>Loading...</div> :

					<div className={style.cards}>
						{listOfItems.map((item, index) => (
							<div key={index}>
								<Card items={item}/>
							</div>
						))}
					</div>
				}
			</div>


			<button
				onClick={handleClick}
			>
				fetch data
			</button>

			Количество товаров: {itemsLenght}
		</div>
	);
};

export default Homepage;
