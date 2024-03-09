import React, {useEffect, useState, useRef, Fragment} from 'react';
import style from './homepage2.module.scss'
import md5 from "md5";
import Card from '../../components/card/card'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Filter from "../../components/filter/filter";
import TuneIcon from '@mui/icons-material/Tune';

const Homepage2 = () => {
	const [listOfID, setListOfID] = useState([]);
	const [offset, setOffset] = useState(0);
	const [limit, setLimit] = useState(51);
	const [listOfItems, setListOfItems] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [page, setPage] = useState(1);
	let URL = 'http://api.valantis.store:40000/';
	let URL2 = 'https://api.valantis.store:41000/';
	const [textForUser, setTextForUser] = useState(`Загрузка`);
	const [allIds, setAllIds] = useState([]);
	// const [isFirstRender, setIsFirstRender] = useState(true);
	const [begin, setBegin] = useState(0);
	const [end, setEnd] = useState(50);
	const [currentIds, setCurrentIds] = useState([]);
	const [isFirstRender, setIsFirstRender] = useState(true);
	const [isHidedAdmin, setIsHidedAdmin] = useState(false);
	const [isHidedFilter, setIsHidedFilter] = useState(true);
	const [filteredItems, setFilteredItems] = useState([]);
	const [filters, setFilters] = useState([]);
	const [allIdsMax, setAllIdsMax] = useState(0);

	const getCurrentDate = () => {
		const date = new Date();
		const year = date.getUTCFullYear();
		const month = (`0${date.getUTCMonth() + 1}`).slice(-2);
		const day = (`0${date.getUTCDate()}`).slice(-2);
		return `${year}${month}${day}`;
	};

	const fetchIdsFromServer = async () => {
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
				const uniqueIds = [...new Set(ids)]
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
				const maxLength = 50;
				// Если длина массива меньше максимальной длины, оставляем его без изменений
				const slicedIdsArray = uniqueIdsArray.length >= maxLength
					? uniqueIdsArray.slice(0, maxLength)
					: uniqueIdsArray;

				const uniqueItems = uniqueIdsArray.map(id => {
					return items.find(item => item.id === id);
				})

				setListOfItems(uniqueItems);
				break;
			} catch (error) {
				console.error("Ошибка при загрузке элементов:", error);
			}
		}
		setIsLoading(false)
		setIsFirstRender(false);
	}

	const getAllIds = async (params) => {
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
						action: params ? 'filter' : 'get_ids',
						params: params || {}
					}),
				});

				const idsData = await idsResponse.json();
				const ids = idsData.result;
				const uniqueAllIds = Array.from(new Set(ids));
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
		// console.log(filters)
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
		if (allIds.length > allIdsMax) {
			setAllIdsMax(allIds.length);
		}
	}, [allIds, allIdsMax]);


	// При isLoading отображается "Загрузка..."
	useEffect(() => {
		setTextForUser(`Загрузка... `);
	}, [isLoading]);

	// При монтировании компонента вызываем tryFetch();
	useEffect(() => {
		tryFetch()
	}, []);

	// При изменении begin, end, allIds срезаем allIds от begin до end
	useEffect(() => {
		setCurrentIds(allIds.slice(begin, end));
	}, [ begin, end]);

	// При изменении page, если это не firstRender получаем актуальные элементы
	useEffect(() => {
		if (!isFirstRender) {
			getCurrentItems(begin, end);
		}
	}, [page]);

	// Когда кол-во элементов в массиве listOfID = 50, вызываем fetchItemsFromServer, затем вызов getAllIds (это нужно для производительности, затем мы не будем использовать listOfID)
	useEffect(() => {
		if (listOfID.length === 50) {
			fetchItemsFromServer(listOfID).then(() => {
					setIsLoading(false);
					getAllIds();
				}
			);
		}
	}, [listOfID.length !== 0]);


	function setHideAdmin() {
		setIsHidedAdmin(!isHidedAdmin);
	}

	function setHideFilter() {
		setIsHidedFilter(!isHidedFilter);
	}


	function applyFilters(filtersFromChildren) {
		setFilters(filtersFromChildren);
	}

	useEffect(() => {
		console.log(`filters homepage2`, filters);
	}, [filters]);

	useEffect(() => {
		getAllIds(filters)
			// .then(getCurrentItems(begin, end))
	}, [filters]);

	useEffect(() => {
		if (!isFirstRender && filters.length !== 0) {
			getCurrentItems(begin, end);
		}
	},[filters, allIds]);

	return (
		<div className={style.layout}>

			<div className={style.filter}>
				{isHidedFilter ?
					<Filter
						onToggle={setHideFilter}
						// onFilterChange={(filters) => console.log(filters)}
						onFilter={applyFilters}
						// onFilter={viewFilters}
					/>
					:
					<button
						className={style.filterBtn}
						onClick={setHideFilter}>
						Открыть фильтр
						<TuneIcon/>
					</button>
				}
			</div>


			<div className={style.homepage}>


				<div

					onClick={setHideAdmin}
				>
					{isHidedAdmin ?
						<div className={style.adminPanelHided}>
							<p> + </p>
						</div>
						:
						<div className={style.adminPanel}>
							<p> page:<span>{page} </span></p>
							<p> listOfItems.length: <span>{listOfItems.length}</span></p>
							<p> listOfID.length: <span> {listOfID.length}</span></p>
							<p> allIds.length:<span>{allIds.length}  </span></p>
							<p> Элементы: {begin} - {end}</p>
						</div>

					}

				</div>

				<div className={style.container}>
					{isLoading ?
						<div> {textForUser} </div>
						:
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
							disabled={page <= 1 || allIds.length === 0 || isLoading}
							onClick={prevPage}
						> {<ArrowBackIcon/>}

						</button>

						<button
							disabled={allIds.length === 0 || isLoading || allIds.length < 50}
							className={style.button}
							onClick={nextPage}
						>
							{<ArrowForwardIcon/>}
						</button>
					</div>


				</div>
			</div>
		</div>

	);
};

export default Homepage2;