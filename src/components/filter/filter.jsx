import React, {useEffect} from 'react';
import style from './filter.module.scss'
import CloseIcon from '@mui/icons-material/Close';

const Filter = (props) => {
	function filter(ids, param) {
		console.log(`$ids.length: ${ids.length}`);
	}

	useEffect(() => {
		filter(props.allIds);
	}, [props.allIds]);
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
						<input name={'product'} placeholder={'Введите название товара'}/>
					</label>
				</div>

				<div className={style.contentInput}>
					<label htmlFor="price">
						Бренд
						<input name={'price'} placeholder={'Введите название бренда'}/>
					</label>
				</div>

				<div className={style.contentInput}>
					<label htmlFor="price">
						Цена
						<input name={'price'} placeholder={'Введите цену товара'}/>
					</label>
				</div>

				<div className={style.contentInput}>
					<label htmlFor="id">
						Id
						<input name={'id'} placeholder={'Введите id товара'}/>
					</label>
				</div>

				<button> Применить</button>
			</div>

		</div>
	)

};

export default Filter;
