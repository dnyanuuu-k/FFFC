import React from "react";
import { Text, StyleSheet } from "react-native";
import { TOP_GAP } from "./constants";
import colors from "themes/colors";

const Title = ({ text, required = false, marginTop, whatIsThis = null, extraTopMargin = false }) => {
	const extraStyle = extraTopMargin ? { marginTop: 40 } : {};
	return (
		<Text style={[style.fieldTitle, extraStyle, { marginTop }]}>
			{text}
			{required ? <Text style={style.required}>*</Text> : null}
			{whatIsThis ? <Text style={style.note}>What is this?</Text> : null}
		</Text>
	);
};

const style = StyleSheet.create({
	fieldTitle: {
		color: colors.textLight,
		fontWeight: 500,
		marginTop: TOP_GAP,
		fontSize: 15,
	},
	required: {
		color: colors.rubyRed,
	},
	note: {
		color: colors.primaryBlue,
		marginLeft: 10,
		fontSize: 12,
		fontWeight: 400,
		cursor: "pointer",
	}
});

export default Title;
