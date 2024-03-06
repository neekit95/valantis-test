import React, {useEffect, useState} from 'react';
import md5 from "md5";
import Card from '../../components/card/card'
import style from './homepage.module.scss'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Homepage = () => {
	const [listOfID, setListOfID] = useState([]);
	const [offset, setOffset] = useState(0);
	const [limit, setLimit] = useState(55);
	const [listOfItems, setListOfItems] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [page, setPage] = useState(1);
	let URL ='http://api.valantis.store:40000/';
	let URL2 = 'https://api.valantis.store:41000/';
	const [textForUser, setTextForUser] = useState('Загрузка...');
	const [allIds, setAllIds] = useState([]);

	const getCurrentDate = () => {
		const date = new Date();
		const year = date.getUTCFullYear();
		const month = (`0${date.getUTCMonth() + 1}`).slice(-2);
		const day = (`0${date.getUTCDate()}`).slice(-2);
		return `${year}${month}${day}`;
	};

	const tryFetch = async () => {
		setTextForUser('Загрузка данных...');
		console.clear();
		const maxAttempts = 3; // Максимальное количество попыток
		// console.group()
		for (let attempt = 1; attempt <= maxAttempts; attempt++) {

			setTextForUser(`Загрузка данных... (попытка ${attempt})`);
			try {
				setTextForUser(`загружаем ids`);
				const timestamp = getCurrentDate();
				const password = 'Valantis';
				const xAuth = md5(`${password}_${timestamp}`);

				const idsResponse = await fetch(URL2, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-Auth': xAuth,
					},
					body: JSON.stringify({
						action: 'get_ids',
						params: {
							offset: offset,
							limit: limit
						},
					}),
				});

				idsResponse ? console.log('idsResponse OK') : console.log('idsResponse is null');

				const idsData = await idsResponse.json();
				const ids = idsData.result;
				console.log('ids.length:', ids.length);
				setTextForUser(`количество id: ${ids.length}. загружаем элементы`);

				const uniqueIds = [...new Set(ids)]
				console.log('uniqueIds.length:', uniqueIds.length);

				setListOfID(uniqueIds);

				const itemsResponse = await fetch(URL2, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-Auth': xAuth,
					},
					body: JSON.stringify({
						action: 'get_items',
						params: {
							'ids': uniqueIds,
							limit: limit
						},
					}),
				});

				itemsResponse ? console.log('itemsResponse OK') : console.log('itemsResponse is null');

				const itemsData = await itemsResponse.json();

				const items = itemsData.result;
				setTextForUser(`количество элементов: ${items.length}`);


				const uniqueItems = Array.from(new Set(items.map(item => item.id))).map(id => {
					return items.find(item => item.id === id);
				});
				// console.log('uniqueItems:', uniqueItems);

				// console.log(uniqueItems.length);
				uniqueItems.length = 50;
				setListOfItems(uniqueItems);
				// Выход из цикла, если запрос успешен
				break;

			} catch (error) {
				console.error(`Error on attempt ${attempt}:`, error);
				if (attempt === maxAttempts) {
					throw new Error('Maximum number of attempts reached');
				}
				setTextForUser('Ошибка загрузки, попробуйте еще раз...');
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
	const getAllIds = async () => {
		const maxAttempts = 10;
		for (let attempt= 1; attempt < maxAttempts ; attempt++) {
			if (attempt === 6) {
				URL2 = URL;
			}
			try {
				const timestamp = getCurrentDate();
				const password = 'Valantis';
				const xAuth = md5(`${password}_${timestamp}`);

				const idsResponse = await fetch(URL2, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-Auth': xAuth,
					},
					body: JSON.stringify({
						action: 'get_ids'
					}),
				});

				const idsData = await idsResponse.json();
				const ids = idsData.result;
				const uniqueAllIds = Array.from(new Set(ids));
				console.log(uniqueAllIds.length);
				setAllIds(uniqueAllIds);
				break;
			} catch (error) {
				console.error("Ошибка:", error)
			}
		}
	}
	const nextPage = async () => {
		setListOfID([])
		setListOfItems([]);
		console.clear();
		await setOffset(prevOffset => prevOffset + 50);
		await setPage(prevPage => prevPage + 1);
		 fetchData()
	}

	const prevPage = async () => {
		setListOfID([])
		setListOfItems([]);
		console.clear();
		await setOffset(prevOffset => prevOffset - 50);
		await setPage(prevPage => prevPage - 1);
		 fetchData()
	}

	useEffect(() => {
		fetchData()
	}, [offset]);

	useEffect(() => {
		getAllIds()
	}, []);
	return (
		<div className={style.homepage}>
			<p> Страница {page}</p>
			<p> Кол-во товаров: {listOfItems.length}</p>
			<p> Кол-во ID: {listOfID.length} </p>

			<div className={style.container}>
				{isLoading ? <div> {textForUser} </div> :

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
					> {<ArrowBackIcon/>}

					</button>

					<button
						className={style.button}
						onClick={nextPage}
					>
						{<ArrowForwardIcon/>}
					</button>
				</div>


			</div>
		</div>
	);
};

export default Homepage;


