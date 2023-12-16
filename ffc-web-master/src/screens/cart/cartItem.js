import React, { PureComponent } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import FilmCard from "./filmCard";
import { BORDER_RADIUS } from "utils/constants";
import colors from "themes/colors";

class CartItem extends PureComponent {
	render() {
		const { data, currency } = this.props;
		const total = Number(data.total).toFixed(2);
		return (
			<View style={style.main}>
				<View style={style.header}>
					<Text style={style.title}>{data.name}</Text>
				</View>

				<FlatList
					data={data.items}
					renderItem={({ item }) => <FilmCard currency={currency} data={item} />}
					ItemSeparatorComponent={<View style={style.hr} />}
				/>

				<View style={style.footer}>
					<Text style={style.key}>
						Subtotal : <Text style={style.value}>{currency}{total}</Text>
					</Text>
				</View>
			</View>
		);
	}
}

const style = StyleSheet.create({
	main: {
		borderRadius: BORDER_RADIUS,
		borderWidth: 1,
		width: "100%",
		borderColor: colors.borderColor,
		marginTop: 30,
	},
	header: {
		height: 60,
		paddingHorizontal: 8,
		flexDirection: "row",
		borderBottomWidth: 1,
		borderColor: colors.borderColor,
		alignItems: "center",
	},
	footer: {
		height: 50,
		marginTop: 20,
		paddingHorizontal: 10,
		borderTopWidth: 1,
		borderColor: colors.borderColor,
		alignItems: "flex-end",
		justifyContent: "center",
	},
	title: {
		fontSize: 18,
		marginLeft: 5,
		color: colors.textBlack,
		fontWeight: "600",
	},
	key: {
		fontSize: 16,
		color: colors.holderColor,
		fontWeight: "400",
	},
	value: {
		fontSize: 16,
		color: colors.textBlack,
		fontWeight: "600",
		textAlign: "right"
	},
	hr: {
		marginTop: 20,
		height: 1,
		width: "100%",
		backgroundColor: colors.borderColor,
	},
});

export default CartItem;