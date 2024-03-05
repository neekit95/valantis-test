import React, {useEffect, useState} from 'react';
import md5 from "md5";
import Card from '../../components/card/card'
import style from './homepage.module.scss'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Homepage = () => {
	const [listOfID, setListOfID] = useState([]);
	const [offset, setOffset] = useState(0);
	const [limit, setLimit] = useState(52);
	const [listOfItems, setListOfItems] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [itemsLenght, setItemsLenght] = useState(0);
	const [page, setPage] = useState(1);

	const getCurrentDate = () => {
		const date = new Date();
		const year = date.getUTCFullYear();
		const month = (`0${date.getUTCMonth() + 1}`).slice(-2);
		const day = (`0${date.getUTCDate()}`).slice(-2);
		return `${year}${month}${day}`;
	};

	const tryFetch = async () => {
		const maxAttempts = 10; // Максимальное количество попыток

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
							// limit: limit,
							limit: limit
						},
					}),
				});

				const idsData = await idsResponse.json();

				const ids = idsData.result;

				const uniqueIds = [...new Set(ids)]
				// console.log('uniqueIds:', uniqueIds);

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
							// 'ids': uniqueIds
							'ids': listOfID
						},
					}),
				});

				const itemsData = await itemsResponse.json();

				const items = itemsData.result;

				const uniqueItems = Array.from(new Set(items.map(item => item.id))).map(id => {
					return items.find(item => item.id === id);
				});
				// console.log('uniqueItems:', uniqueItems);

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

	useEffect(() => {
		fetchData()
	}, [offset]);

	const nextPage = () => {
		setListOfID([])
		setListOfItems([]);
		console.clear();
		setOffset(prevOffset => prevOffset + 50);
		setPage(prevPage => prevPage + 1);
		fetchData()
	}
	const prevPage = () => {
		setListOfID([])
		setListOfItems([]);
		console.clear();
		setOffset(prevOffset => prevOffset - 50);
		setPage(prevPage => prevPage - 1);
		fetchData()
	}

	const findFiltered = (e) => {
		setListOfID([])
		setListOfItems([]);
		console.clear();
		setOffset(0);
		setPage(1);
		setLimit(e.target.value);
		fetchData()
	}


	return (
		<div className={style.homepage}>
			<p> Страница {page}</p>
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

			<div className={style.buttons}>

					<div className={style.buttons}>

						<button
							className={style.button}
							disabled={page <= 1}
							onClick={prevPage}
						> {<ArrowBackIcon />}

						</button>

						<button
							className={style.button}
							onClick={nextPage}
						>
							{<ArrowForwardIcon />}
						</button>
					</div>


			</div>
		</div>
	);
};

export default Homepage;
