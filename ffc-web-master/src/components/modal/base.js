import React, { useState, useImperativeHandle, forwardRef } from "react";
import { View, Modal, Text, Animated, StyleSheet } from "react-native";
import {
	WINDOW_WIDTH,
	WINDOW_HEIGHT,
	HEADER_HEIGHT,
	BORDER_RADIUS,
	FORM_FONT_SIZE
} from "../../utils/constants";
import colors from "../../themes/colors";

const ModalBase = ({ onClose, newError, visible, children, width, height }, ref) => {
	useImperativeHandle(ref, () => ({
		error
	}));
	const [errorPosition] = useState(new Animated.Value(-HEADER_HEIGHT));
	const [errorText, setErrorText] = useState("");

	const error = (errorText, callback = null) => {
		setErrorText(errorText);
		Animated.spring(errorPosition, {
			toValue: 0,
			useNativeDriver: true,
		}).start();
		setTimeout(() => {
			Animated.timing(errorPosition, {
				toValue: -HEADER_HEIGHT,
				useNativeDriver: true,
			}).start();
			if(typeof callback === "function"){
				callback();
			}
		}, 2000);
	};

	return (
		<Modal
			onRequestClose={onClose}
			visible={visible}
			transparent
			animationType="fade"
		>
			<View style={style.main}>
				<View style={[style.content, { width, height }]}>
					{children}
					<Animated.View
						style={[
							style.errorRow,
							{ transform: [{ translateY: errorPosition }] },
						]}
					>
						<Text style={style.errorText}>{errorText}</Text>
					</Animated.View>
				</View>
			</View>
		</Modal>
	);
};

const style = StyleSheet.create({
	main: {
		height: WINDOW_HEIGHT,
		width: WINDOW_WIDTH,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.bgTrans,
	},
	content: {
		overflow: "hidden",
		borderRadius: BORDER_RADIUS,
		backgroundColor: colors.popupBg,
	},
	errorRow: {
		height: HEADER_HEIGHT,
		backgroundColor: colors.rubyRed,
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		top: 0,
	},
	errorText: {
		color: colors.buttonTxt,
		fontSize: FORM_FONT_SIZE
	}
});

export default forwardRef(ModalBase);