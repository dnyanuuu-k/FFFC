import React from "react";
import {
	View,
	Text,
	StyleSheet
} from "react-native";
import Image from "components/image";
import colors from "themes/colors";
import { BORDER_RADIUS } from "utils/constants";

const FilmCard = ({ data, currency }) => {
	const fee = Number(data.feeInCurrency).toFixed(2);
	return (
		<View style={style.main}>
			<Image
				source={data.thumbUrl}
				style={style.image}
				hash={data.thumbHash}
				resizeMode="cover"
			/>
			<View style={style.content}>
				<Text style={style.title}>
					{data.film.title}
				</Text>
				<Text style={style.key}>
					Category : <Text style={style.value}>{data.categoryName}</Text>
				</Text>
				<Text style={style.key}>
					Deadline  : <Text style={style.value}>{data.deadlineName}</Text>
				</Text>				
			</View>
			<View style={style.options}>
				<Text style={style.remove}>
					REMOVE
				</Text>				
				<Text style={style.key}>
					Standard  : <Text style={style.fee}>{currency}{fee}</Text>
				</Text>				
			</View>
		</View>
	)
};

const style = StyleSheet.create({
	main: {
		width: "100%",
		marginTop: 20,
		flexDirection: "row",
		paddingHorizontal: 10		
	},
	content: {
		flex: 1,
		paddingLeft: 10
	},
	options: {
		justifyContent: 'space-between',
		alignItems: 'flex-end'
	},
	image: {
		height: 78,
		width: 78,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: colors.borderColor,
		borderRadius: BORDER_RADIUS,
		backgroundColor: colors.borderColor
	},
	title: {
		fontSize: 16,
		color: colors.textBlack,
		fontWeight: "bold"
	},
	key: {
		fontSize: 15,
		color: colors.holderColor,
		fontWeight: "300",
		marginTop: 8
	},
	value: {
		fontSize: 15,		
		color: colors.textBlack,
		fontWeight: "300",
		textAlign: "right"
	},
	fee: {
		fontSize: 16,		
		color: colors.textBlack,
		fontWeight: "600",
		textAlign: "right"
	},
	remove: {
		fontSize: 13,
		fontWeight: '500',
		color: colors.rubyRed
	}
});

export default FilmCard;