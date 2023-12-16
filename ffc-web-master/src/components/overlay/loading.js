import React from "react";
import { View, ActivityIndicator } from "react-native";
import colors from "themes/colors";

const Loading = ({ busy = true, size = 35, style = {} } = {}) => {
	return busy ? (
		<View style={[main, style]}>
			<ActivityIndicator size={size} color={colors.popupBg} />
		</View>
	) : null;
};

const main = {
	backgroundColor: colors.bgTrans,
	justifyContent: "center",
	alignItems: "center",
	width: "100%",
	height: "100%",
	position: "absolute",
};

export default Loading;