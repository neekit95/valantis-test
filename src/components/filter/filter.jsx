import React, {useEffect, useState} from 'react';
import style from './filter.module.scss'
import CloseIcon from '@mui/icons-material/Close';

const Filter = (props) => {

	const [filters, setFilters] = useState({
		product: '',
		brand: '',
		price: '',
		id: '',
	});

	useEffect(() => {
		console.log('filters', filters);
	}, [filters]);

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
	};

	const handleFilterSubmit = () => {
		props.onFilter(filters);
	};

	return (
		<div className={style.container}>

			<div className={style.buttonContainer}>
				<button
					className={style.button}
					onClick={props.onToggle}
				>
					<CloseIcon/>
				</button>
			</div>

			<div className={style.content}>

				<div className={style.contentInput}>

					<label htmlFor="product">
						Название
						<input
							name={'product'}
							placeholder={'Введите название товара'}
							value={filters.product}
							onChange={handleInputChange}
						/>
					</label>
				</div>

				<div className={style.contentInput}>
					<label htmlFor="brand">
						Бренд
						<input
							name={'brand'}
							placeholder={'Введите название бренда'}
							value={filters.brand}
							onChange={handleInputChange}
						/>
					</label>
				</div>

				<div className={style.contentInput}>
					<label htmlFor="price">
						Цена
						<input
							name={'price'}
							placeholder={'Введите цену товара'}
							value={filters.price}
							onChange={handleInputChange}
						/>
					</label>
				</div>

				<div className={style.contentInput}>
					<label htmlFor="id">
						Id
						<input
							name={'id'}
							placeholder={'Введите id товара'}
							value={filters.id}
							onChange={handleInputChange}
						/>
					</label>
				</div>

				<button
					className={style.submitButton}
					onClick={handleFilterSubmit}
				>
					Применить
				</button>
			</div>

		</div>
	)

};

export default Filter;
