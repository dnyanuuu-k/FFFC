import React, { Component } from "react";
import { Modal, Animated, Text, View, TouchableOpacity } from "react-native";
import colors from "themes/colors";
import {
	WINDOW_WIDTH,
	WINDOW_HEIGHT,
	W27,
	BORDER_RADIUS,
	BUTTON_FORM_HEIGHT,
	FORM_FONT_SIZE,
} from "utils/constants";
const AnimatedView = Animated.createAnimatedComponent(TouchableOpacity);
const maxHeight = WINDOW_HEIGHT * 0.8;
class SheetButtonModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			animation: new Animated.Value(100),
			errorPosition: new Animated.Value(-BUTTON_FORM_HEIGHT),
			v: false,
		};
	}

	open = () => {
		this.setState(
			{
				v: true,
			},
			() => {
				this.animate(0);
			}
		);
	};

	error = (errorText) => {
		this.setState({ errorText });
		Animated.spring(this.state.errorPosition, {
			toValue: 0,
			useNativeDriver: true
		}).start();
		setTimeout(() => {
			Animated.timing(this.state.errorPosition, {
				toValue: -BUTTON_FORM_HEIGHT,
				useNativeDriver: true
			}).start();
		}, 2000);
	};

	close = () => {
		this.animate(100);
		this.setState({ v: false }, () => {
			if (typeof this.props?.onClose === "function") this.props.onClose();
		});
	};

	animate = (toValue) => {
		Animated.spring(this.state.animation, {
			toValue,
			duration: 500,
			useNativeDriver: true,
		}).start();
	};

	render() {
		const { animation, v, errorText, errorPosition } = this.state;
		const { children, onSubmit, title, width, minHeight, positiveText } = this.props;
		const buttonWidth = width / 2;
		return (
			<Modal visible={v} animationType="fade" transparent>
				<TouchableOpacity
					onPress={this.close}
					activeOpacity={1}
					style={style.main}
				>
					<AnimatedView
						activeOpacity={1}
						style={[
							style.content,
							width,
							{ transform: [{ translateY: animation }] },
						]}
					>
						<View style={style.header}>
							<Text style={style.title}>{title}</Text>
						</View>
						<View style={[style.body, { minHeight }]}>{children}</View>
						<View style={style.buttonRow}>
							<TouchableOpacity
								style={[
									style.buttonCancel,
									{ width: buttonWidth },
								]}
								onPress={this.close}
							>
								<Text
									style={[style.buttonText, style.redColor]}
								>
									Cancel
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={onSubmit}
								style={[
									style.buttonSubmit,
									{ width: buttonWidth },
								]}
							>
								<Text style={style.buttonText}>
									{positiveText}
								</Text>
							</TouchableOpacity>
						</View>
						<Animated.View
							style={[
								style.errorRow,
								{ transform: [{ translateY: errorPosition }] },
							]}
						>
							<Text style={style.errorText}>{errorText}</Text>
						</Animated.View>
					</AnimatedView>
				</TouchableOpacity>
			</Modal>
		);
	}
}
const style = {
	main: {
		backgroundColor: colors.bgTrans,
		height: WINDOW_HEIGHT,
		width: WINDOW_WIDTH,
		alignItems: "center",
		justifyContent: "center",
		outline: "none",
	},
	content: {
		borderRadius: BORDER_RADIUS,
		backgroundColor: colors.popupBg,
		overflow: "hidden",
		cursor: "default",
	},
	title: {
		fontSize: 18,
		color: colors.textBlack,
		fontWeight: "bold",
	},
	header: {
		height: BUTTON_FORM_HEIGHT,
		borderBottomWidth: 1,
		paddingLeft: 10,
		borderColor: colors.borderColor,
		justifyContent: "center",
	},
	body: {
		maxHeight,
		overflowY: "auto",
		padding: 10,
	},
	row: {
		justifyContent: "space-between",
		flexDirection: "row",
		marginBottom: 5,
		marginTop: 20,
	},
	errorRow: {
		height: BUTTON_FORM_HEIGHT,
		backgroundColor: colors.rubyRed,
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		top: 0,
	},
	buttonRow: {
		flexDirection: "row",
		borderTopWidth: 1,
		borderColor: colors.borderColor,
		marginTop: 10,
	},
	buttonCancel: {
		height: BUTTON_FORM_HEIGHT,
		justifyContent: "center",
		alignItems: "center",
		borderColor: colors.borderColor,
	},
	buttonSubmit: {
		height: BUTTON_FORM_HEIGHT,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.primaryBlue,
	},
	buttonText: {
		fontSize: FORM_FONT_SIZE,
		color: colors.buttonTxt,
		fontWeight: "500",
	},
	redColor: {
		color: colors.rubyRed,
	},
	errorText: {
		color: colors.buttonTxt,
		fontSize: FORM_FONT_SIZE
	}
};

SheetButtonModal.defaultProps = {
	onSubmit: () => {},
	width: W27,
	title: "",
	positiveText: "Submit",
};

export default SheetButtonModal;