import React from 'react';
import style from './card.module.scss'

const Card = (props) => {
	return (
		<div className={style.container}>

			<div className={style.product}>
				{props.items.product}
			</div>

			<div className={style.brand}>
				{props.items.brand}
			</div>

			<div className={style.price}>
				price: <span className={style.span}> {props.items.price} </span> ₽
			</div>

			<div className={style.id}>
				id: {props.items.id}
			</div>


		</div>
	);
};

export default Card;
