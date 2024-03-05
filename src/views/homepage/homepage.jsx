import React, {useEffect, useState} from 'react';
import md5 from "md5";
import Card from '../../components/card/card'
import style from './homepage.module.scss'

const Homepage = () => {
	const [listOfID, setListOfID] = useState([]);
	const [offset, setOffset] = useState(0);
	const [limit, setLimit] = useState(52);
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

	const tryFetch = async () => {
		const maxAttempts = 4; // Максимальное количество попыток

		for (let attempt = 1; attempt <= maxAttempts; attempt++) {
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

				const uniqueIds = [...new Set(ids)]
				console.log('uniqueIds:', uniqueIds);

				setListOfID(uniqueIds);

				const itemsResponse = await fetch('http://api.valantis.store:40000/', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-Auth': xAuth,
					},
					body: JSON.stringify({
						action: 'get_items',
						params: {
							'ids': uniqueIds
						},
					}),
				});

				const itemsData = await itemsResponse.json();

				const items = itemsData.result;
				console.log('items:', items);

				const uniqueItems = Array.from(new Set(items.map(item => item.id))).map(id => {
					return items.find(item => item.id === id);
				});
				console.log('uniqueItems:', uniqueItems);

				uniqueItems.length = 50;
				setListOfItems(uniqueItems);
				// Выход из цикла, если запрос успешен
				break;

			} catch (error) {

				console.error(`Error on attempt ${attempt}:`, error);

				if (attempt === maxAttempts) {
					throw new Error('Maximum number of attempts reached');
				}
			}
		}
	};

	const fetchData = async () => {

		setIsLoading(true);

		try {
			await tryFetch();
		} catch (error) {
			console.error('Error:', error);
		}

		setIsLoading(false);

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
