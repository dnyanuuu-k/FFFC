import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import FeatherIcon from "feather-icons-react";
import { FORM_SM_FONT_SIZE, BORDER_RADIUS } from "utils/constants";
import colors from "themes/colors";

const Checkbox = (props = {}) => {
	const {
		label = "",
		height = 20,
		width = 70,
		onChange,
		checked = false,
		cardStyle = {},
		textStyle = {}
	} = props;
	const backgroundColor = checked ? colors.primaryBlue : colors.popupBg;
	return (
		<TouchableOpacity
			onPress={() => onChange(!checked)}
			style={[style.option, cardStyle, { height, minWidth: width }]}
		>
			<View style={[style.icon, { backgroundColor }]}>
				{checked ? (
					<FeatherIcon
						icon="check"
						color={colors.buttonTxt}
						size={14}
					/>
				) : null}
			</View>
			<Text style={[style.optionText, textStyle]}>{label}</Text>
		</TouchableOpacity>
	);
};

const style = StyleSheet.create({
	option: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 10,
		outline: "none",
	},
	optionText: {
		fontSize: FORM_SM_FONT_SIZE,
		marginLeft: 8,
	},
	icon: {
		justifyContent: "center",
		alignItems: "center",
		borderRadius: BORDER_RADIUS,
		borderWidth: 1,
		width: 20,
		height: 20,
		borderColor: colors.holderColor,
	},
});

export default Checkbox;
