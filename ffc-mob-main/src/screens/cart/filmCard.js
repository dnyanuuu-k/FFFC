import React from 'react';
import { View, Text } from 'react-native';
import Image from 'components/image';

const FilmCard = ({ data, currency, style, onRemove }) => {
	const fee = Number(data.feeInCurrency).toFixed(2);
	return (
		<View style={style.main}>
			<View style={style.row}>
				<Image
					source={data.thumbUrl}
					style={style.image}
					hash={data.thumbHash}
					resizeMode="cover"
				/>
				<View style={style.content}>
					<Text style={style.title}>{data.film.title}</Text>
				</View>
			</View>
			<Text style={style.key}>
				Category : <Text style={style.value}>{data.categoryName}</Text>
			</Text>
			<Text style={style.key}>
				Deadline : <Text style={style.value}>{data.deadlineName}</Text>
			</Text>

			<Text
				onPress={() =>
					onRemove({
						id: data.id,
						title: data.film.title,
					})
				}
				style={style.remove}
			>
				REMOVE
			</Text>
			<View style={style.feeText}>
				<Text style={style.key}>
					Standard :{' '}
					<Text style={style.fee}>
						{currency}
						{fee}
					</Text>
				</Text>
			</View>
		</View>
	);
};

export default FilmCard;