import React, {useEffect, useState, useRef} from 'react';
import style from './homepage2.module.scss'
import md5 from "md5";
import Card from '../../components/card/card'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Homepage2 = () => {
	const [listOfID, setListOfID] = useState([]);
	const [offset, setOffset] = useState(0);
	const [limit, setLimit] = useState(51);
	const [listOfItems, setListOfItems] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [page, setPage] = useState(1);
	let URL = 'http://api.valantis.store:40000/';
	let URL2 = 'https://api.valantis.store:41000/';
	const [textForUser, setTextForUser] = useState('Загрузка...');
	const [allIds, setAllIds] = useState([]);
	// const [isFirstRender, setIsFirstRender] = useState(true);
	const [begin, setBegin] = useState(0);
	const [end, setEnd] = useState(50);
	const [currentIds, setCurrentIds] = useState([]);
	const [isFirstRender, setIsFirstRender] = useState(true);


	const getCurrentDate = () => {
		const date = new Date();
		const year = date.getUTCFullYear();
		const month = (`0${date.getUTCMonth() + 1}`).slice(-2);
		const day = (`0${date.getUTCDate()}`).slice(-2);
		return `${year}${month}${day}`;
	};

	const fetchIdsFromServer = async () => {
		// console.clear();
		setIsLoading(true);
		const maxAttempts = 10;
		for (let attempt = 1; attempt <= maxAttempts; attempt++) {

			if (attempt === 6) {
				URL2 = URL;
			}
			try {
				const timestamp = getCurrentDate();
				const password = 'Valantis';
				const xAuth = md5(`${password}_${timestamp}`);

				console.log(`загружаем ids (попытка ${attempt})`);

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

				const idsData = await idsResponse.json();

				const ids = idsData.result;
				console.log(`количество ID при попытке № ${attempt}: ${ids.length}`);

				const uniqueIds = [...new Set(ids)]
				console.log(`Количество уникальных ID при попытке № ${attempt}:`, uniqueIds.length);

				setListOfID(uniqueIds);

				break;

			} catch (error) {
				console.error(`Error on attempt ${attempt}:`, error);
				if (attempt === maxAttempts) {
					throw new Error('Maximum number of attempts reached');
				}
			}

		}
	}

	const fetchItemsFromServer = async (ids) => {
		const maxAttempts = 10;
		for (let attempt = 1; attempt < maxAttempts; attempt++) {
			if (attempt === 6) {
				URL2 = URL;
			}
			try {
				const timestamp = getCurrentDate();
				const password = 'Valantis';
				const xAuth = md5(`${password}_${timestamp}`);

				const itemsResponse = await fetch(URL2, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-Auth': xAuth,
					},
					body: JSON.stringify({
						action: 'get_items',
						params: {
							'ids': ids,
							limit: limit
						},
					}),
				});

				const itemsData = await itemsResponse.json();
				const items = itemsData.result;
				const id = items.map(item => item.id);

				// создаем массив из уникальных упорядоченных элементов по id
				const uniqueIdsSet = new Set(id);
				const uniqueIdsArray = Array.from(uniqueIdsSet);
				const uniqueItems = uniqueIdsArray.map(id => {
					return items.find(item => item.id === id);
				})
				uniqueItems.length = 50;
				setListOfItems(uniqueItems);
				break;
			} catch (error) {
				console.error("Ошибка при загрузке элементов:", error);
			}
		}
		setIsLoading(false)
		setIsFirstRender(false);
	}

	const getAllIds = async () => {
		const maxAttempts = 10;
		for (let attempt = 1; attempt < maxAttempts; attempt++) {
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
				console.log(`Всего  id на сервере: ${ids.length}`);
				const uniqueAllIds = Array.from(new Set(ids));
				console.log(`Всего уникальных id на сервере: ${uniqueAllIds.length}`);
				setAllIds(uniqueAllIds);
				break;
			} catch (error) {
				console.error("Ошибка:", error)
			}
		}
	}

	const getCurrentItems = async (from, to) => {
		const currentItems = allIds.slice(from, to);
		await fetchItemsFromServer(currentItems);
	};


	const nextPage = async () => {
		setIsLoading(true)
		await setListOfID([])
		await setListOfItems([]);
		await setBegin(prevBegin => prevBegin + 50);
		await setEnd(prevEnd => prevEnd + 50);
		await setPage(prevPage => prevPage + 1);
		// setIsLoading(false);
	}

	const prevPage = async () => {
		setIsLoading(true)
		await setListOfID([])
		await setListOfItems([]);
		await setBegin(prevBegin => prevBegin - 50);
		await setEnd(prevEnd => prevEnd - 50);
		await setPage(prevPage => prevPage - 1);
		// setIsLoading(false);
	}


	const tryFetch = async () => {
		setIsLoading(true);
		try {
			setTextForUser(`Загрузка данных...`);
			await fetchIdsFromServer();
		} catch (error) {
			console.error("Error:", error);
			setTextForUser('Произошла ошибка, попробуйте еще раз...');
		}
	};

	useEffect(() => {
		setTextForUser('Загрузка...');
	}, [isLoading]);

	useEffect(() => {
		tryFetch()
	}, []);

	useEffect(() => {
		console.log('allIds', allIds.length)
		setCurrentIds(allIds.slice(begin, end));
	}, [allIds, begin, end]);

	useEffect(() => {
		if (!isFirstRender) {
			getCurrentItems(begin, end);
		}
		console.log('begin', begin);
		console.log('end', end);
	}, [page]);

	useEffect(() => {
		console.log('currentIds', currentIds.length)
	}, [currentIds]);

	useEffect(() => {
		console.log('listOfItems', listOfItems)
	}, [listOfID, listOfItems]);

	useEffect(() => {
		if (listOfID.length === 50) {
			fetchItemsFromServer(listOfID).then(() => {
					setIsLoading(false);
					getAllIds();
				// if (isLoading === false) {
				// 	getAllIds();
				// }
				}
			);
		}
	}, [listOfID.length !== 0]);

	// useEffect(() => {
	// 	if (isLoading === false) {
	// 		getAllIds();
	// 	}
	// }, [isFirstRender]);


	return (
		<div className={style.homepage}>
			<div className={style.adminPanel}>
				<p> page:<span>{page} </span></p>
				<p> listOfItems.length: <span>{listOfItems.length}</span></p>
				<p> listOfID.length: <span> {listOfID.length}</span></p>
				<p> allIds.length:<span>{allIds.length}  </span></p>
				<p> Элементы: {begin} - {end}</p>

			</div>

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
						disabled={page <= 1 || allIds.length === 0}
						onClick={prevPage}
					> {<ArrowBackIcon/>}

					</button>

					<button
						disabled={allIds.length === 0}
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

export default Homepage2;


