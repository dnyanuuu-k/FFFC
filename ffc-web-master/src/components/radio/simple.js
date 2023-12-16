import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import colors from "themes/colors";

const SimpleRadio = ({ size = 18, selected, onChange }) => (
	<Pressable
		onPress={() => onChange(!selected)}
		style={[
			style.radio,
			{
				width: size,
				height: size,
				borderColor: selected ? colors.primaryBlue : colors.holderColor,
			},
		]}
	>
		{selected ? <View style={style.selected} /> : null}
	</Pressable>
);

const style = StyleSheet.create({
	radio: {
		borderWidth: 2,
		borderRadius: 100,
		padding: 3,
	},
	selected: {
		width: "100%",
		height: "100%",
		borderRadius: 100,
		backgroundColor: colors.primaryBlue,
	},
});

export default SimpleRadio;