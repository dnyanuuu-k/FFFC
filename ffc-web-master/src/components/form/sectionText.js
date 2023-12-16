import React from "react";
import { View, Text, StyleSheet } from "react-native";

import colors from "themes/colors";
import { FORM_FONT_SIZE, FORM_SM_FONT_SIZE } from "utils/constants";
import { formWidth, TOP_GAP, TOP_GAP2 } from "./constants";

const SectionText = ({ text, subText = null }) => {
	return (
		<View style={style.sectionCover}>
			<Text style={style.sectionText}>{text}</Text>
			{subText ? (
				<Text style={style.sectionSubText}>{subText}</Text>
			) : null}
		</View>
	);
};

const style = StyleSheet.create({
	sectionCover: {
		borderBottomWidth: 1,
		boderColor: colors.borderColor,
		width: formWidth,
		marginTop: TOP_GAP,
		paddingBottom: TOP_GAP2,
		borderColor: colors.borderColor,
	},
	sectionText: {
		fontSize: FORM_FONT_SIZE,
		color: colors.textBlack,
		fontWeight: "bold",
	},
	sectionSubText: {
		marginTop: 3,
		fontSize: FORM_SM_FONT_SIZE,
		color: colors.holderColor,
	},
});

export default SectionText;