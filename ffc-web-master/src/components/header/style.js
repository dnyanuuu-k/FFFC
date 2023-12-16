import {
	WINDOW_WIDTH,
	HEADER_HEIGHT,
	LOGO_WIDTH,
	LOGO_HEIGHT,
} from "utils/constants";
import colors from "themes/colors";

const iconSize = HEADER_HEIGHT - 15;

const style = {
	main: {
		height: HEADER_HEIGHT,
		width: WINDOW_WIDTH,
		borderBottomWidth: 1,
		borderColor: colors.borderColor,
		paddingHorizontal: 15,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	logo: {
		width: LOGO_WIDTH,
		height: LOGO_HEIGHT,
	},
	optionCover: {
		flexDirection: "row",
		alignItems: "center",
		height: HEADER_HEIGHT,		
	},
	optionText: {
		marginLeft: 60,
		fontSize: 16,
		color: colors.textBlack,
		fontWeight: 600,
		cursor: "pointer"
	},
	optionSelected: {
		marginLeft: 60,
		fontSize: 16,
		color: colors.primaryBlue,
		fontWeight: 600,
		cursor: "pointer"
	},
	optionIcon: ({ hovered, focused, pressed }) => {
		const clicked = focused || pressed;
		return {
			width: iconSize,
			height: iconSize,
			marginLeft: 20,
			borderRadius: 100,
			backgroundColor: clicked ? colors.primaryLight : (hovered ? colors.vectorBaseDip : colors.vectorBase ),
			justifyContent: "center",
			alignItems: "center",
			outline: "none"
		}
	}
};

export default style;