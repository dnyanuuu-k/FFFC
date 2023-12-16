import React from 'react';
import { View, Modal, ActivityIndicator } from "react-native";
import colors from "themes/colors";
import {
	WINDOW_WIDTH,
	WINDOW_HEIGHT
} from "utils/constants";

const Loading = ({ busy = true } = {}) => {
	return (
		<Modal visible={busy} transparent animationType="fade">
			<View style={style.main}>
				<ActivityIndicator size={35} color={colors.popupBg} />
			</View>
		</Modal>
	)
}

const style = {
	main: {
		justifyContent: "center",
		alignItems: "center",
		width: WINDOW_WIDTH,
		height: WINDOW_HEIGHT,
		backgroundColor: colors.bgTrans
	}
}

export default Loading;