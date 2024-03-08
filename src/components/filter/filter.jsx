import React, { useEffect, useState } from 'react';
import style from './filter.module.scss';
import CloseIcon from '@mui/icons-material/Close';

const Filter = (props) => {
	const [filters, setFilters] = useState({
		product: '',
		brand: '',
		price: '',
	});

	function resetFilters() {
		setFilters({
			product: '',
			brand: '',
			price: '',
		});
	}
	const [activeField, setActiveField] = useState('');

	const handleInputChange = (event) => {
		const { name, value } = event.target;

		// Если поле price, фильтруем ввод пользователя, оставляя только цифры
		if (name === 'price') {
			const filteredValue = value.replace(/[^0-9]/g, ''); // Оставляем только цифры
			setFilters((prevFilters) => ({ ...prevFilters, [name]: filteredValue }));
		} else {
			setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
		}

		setActiveField(name);
	};

	const handleFilterSubmit = () => {
		// Фильтруем только непустые значения
		const filteredValues = Object.fromEntries(
			Object.entries(filters).filter(([key, value]) => value !== '')
		);

		// Приводим поле price к числовому значению
		if (filteredValues.price) {
			filteredValues.price = parseFloat(filteredValues.price);
		}

		// Фильтрация, если есть хотя бы одно непустое значение
		if (Object.keys(filteredValues).length > 0) {
			props.onFilter(filteredValues);
		}

		resetFilters()
	};

	return (
		<div className={style.container}>
			<div className={style.buttonContainer}>
				<button className={style.button} onClick={props.onToggle}>
					<CloseIcon />
				</button>
			</div>
			<div className={style.content}>
				<div className={style.contentInput}>
					<label htmlFor="product">
						Название
						<input
							name={'product'}
							placeholder={'Введите название товара'}
							value={activeField === 'product' ? filters.product : ''}
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
							value={activeField === 'brand' ? filters.brand : ''}
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
							value={activeField === 'price' ? filters.price : ''}
							onChange={handleInputChange}
						/>
					</label>
				</div>
				<button className={style.submitButton} onClick={handleFilterSubmit}>
					Применить
				</button>
			</div>
		</div>
	);
};

export default Filter;
