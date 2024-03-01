import React from 'react';
import style from './card.module.scss'

const Card = (props) => {
	console.log('props.id:', props.id)
	return (
		<div className={style.container}>
			<p>
				id:
				{props.id}
			</p>
		</div>
	);
};

export default Card;
