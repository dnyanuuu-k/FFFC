import React from 'react';
import { View, Text } from 'react-native';
import Image from 'components/image';

const ProductCard = ({ data, currency, style, onRemove }) => {
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
					<Text style={style.title}>{data.title}</Text>
				</View>
			</View>
			<Text style={style.key}>
				Plan : <Text style={style.value}>{data.planName}</Text>
			</Text>
			<Text
				onPress={() =>
					onRemove({
						id: data.id,
						title: data.title,
					})
				}
				style={style.remove}
			>
				REMOVE
			</Text>
			<View style={style.feeText}>
				<Text style={style.key}>
					Fee :{' '}
					<Text style={style.fee}>
						{currency}
						{fee}
					</Text>
				</Text>
			</View>
		</View>
	);
};

export default ProductCard;
