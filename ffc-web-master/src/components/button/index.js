import React, { PureComponent } from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { BORDER_RADIUS, BUTTON_HEIGHT } from "utils/constants";
import colors from "themes/colors";
import FeatherIcon from "feather-icons-react";
const getTypeStyle = (type) => {
	switch (type) {
		case Button.SUCCESS:
			return {
				btnSty: {
					...defaultStyle.main,
					backgroundColor: colors.greenDark,
				},
				txtSty: defaultStyle.txt,
			};
		case Button.PRIMARY:
			return { btnSty: defaultStyle.main, txtSty: defaultStyle.txt };
		case Button.ICON_PRIMARY:
			return { btnSty: defaultStyle.main2, txtSty: defaultStyle.txt6 };
		case Button.SECONDARY:
			return {
				btnSty: defaultStyle.secondary,
				txtSty: defaultStyle.txt2,
			};
		case Button.OUTLINE_PRIMARY:
			return { btnSty: defaultStyle.outline, txtSty: defaultStyle.txt2 };
		case Button.OUTLINE_ICON_PRIMARY:
			return { btnSty: defaultStyle.outline2, txtSty: defaultStyle.txt3 };
		case Button.OUTLINE_ICON_SUCCESS:
			return {
				btnSty: {
					...defaultStyle.outline2,
					borderColor: colors.greenDark,
				},
				txtSty: defaultStyle.txt4,
			};
		case Button.OUTLINE_ICON_DANGER:
			return {
				btnSty:defaultStyle.outline3,
				txtSty: defaultStyle.txt5,
			};
		default:
			return { btnSty: defaultStyle.main, txtSty: defaultStyle.txt };
	}
};

export default class Button extends PureComponent {
	static SUCCESS = 0;
	static PRIMARY = 1;
	static SECONDARY = 4;

	static ICON_PRIMARY = 7;

	static OUTLINE_PRIMARY = 2;	
	static OUTLINE_ICON_PRIMARY = 3;
	static OUTLINE_ICON_SUCCESS = 5;
	static OUTLINE_ICON_DANGER = 6;

	render() {
		const {
			text,
			style,
			onPress,
			type,
			busy,
			icon = null,
			iconSize = 22,
			textStyle = {},
		} = this.props;
		const { btnSty, txtSty } = getTypeStyle(type, text);
		return (
			<TouchableOpacity style={[btnSty, style]} onPress={onPress}>
				{icon ? (
					<FeatherIcon
						icon={icon}
						color={txtSty.color}
						size={iconSize}
					/>
				) : null}
				{busy ? (
					<ActivityIndicator color={txtSty.color} />
				) : (
					<Text style={[txtSty, textStyle]}>{text}</Text>
				)}
			</TouchableOpacity>
		);
	}
}

Button.defaultProps = {
	type: Button.PRIMARY,
	style: {},
	busy: false,
};

const base = {
	width: "100%",
	height: BUTTON_HEIGHT,
	justifyContent: "center",
	alignItems: "center",
	borderRadius: BORDER_RADIUS,
	outline: "none",
};

const baseTxt = {
	fontSize: 18,
	fontWeight: 500,
};

const defaultStyle = {
	main: {
		...base,
		backgroundColor: colors.primaryBlue,
	},
	main2: {
		...base,
		flexDirection: "row",
		backgroundColor: colors.primaryBlue,
	},
	secondary: {
		...base,
		backgroundColor: colors.vectorBase,
	},
	outline: {
		...base,
		borderWidth: 1,
		borderColor: colors.primaryBlue,
	},
	outline2: {
		...base,
		flexDirection: "row",
		borderWidth: 1,
		borderColor: colors.primaryBlue,
	},
	outline3: {
		...base,
		flexDirection: "row",
		borderWidth: 1,
		borderColor: colors.rubyRed,
	},

	txt: {
		...baseTxt,
		color: colors.buttonTxt,
	},
	txt2: {
		...baseTxt,
		color: colors.primaryBlue,
	},
	txt3: {
		...baseTxt,
		color: colors.primaryBlue,
		marginLeft: 10,
	},
	txt4: {
		...baseTxt,
		color: colors.greenDark,
		marginLeft: 10,
	},
	txt5: {
		...baseTxt,
		color: colors.rubyRed,
		marginLeft: 10,
	},
	txt6: {
		...baseTxt,
		color: colors.buttonTxt,
		marginLeft: 10,
	},
};