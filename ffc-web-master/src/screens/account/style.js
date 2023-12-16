//Constants
import {
	WINDOW_WIDTH,
	WINDOW_HEIGHT,
	CONTENT_HEIGHT,
	BORDER_RADIUS,
	W70,
	W50,
	W30,
	W40
} from "utils/constants";
import colors from "themes/colors";

const accountPadding = W30 * 0.15;
const accountWidth = W30 - accountPadding;
const accountHeight = CONTENT_HEIGHT - (CONTENT_HEIGHT * 0.12);

const style = {
	main: {
		height: WINDOW_HEIGHT,
		width: WINDOW_WIDTH,
	},
	content: {
		height: CONTENT_HEIGHT,
		width: WINDOW_WIDTH,
		flexDirection: "row",
	},
	infoCover: {
		width: W70,
		height: CONTENT_HEIGHT,
		borderRightWidth: 1,
		borderColor: colors.borderColor,
		alignItems: "center",
		paddingTop: 60
	},
	accountCover: {
		width: W30,
		height: CONTENT_HEIGHT,
		alignItems: "center",
		justifyContent: "center",
	},
	accountContent: {
		width: accountWidth,
		height: accountHeight,
		justifyContent: "center"
	},
	title: {
		fontSize: 22,
		color: colors.textBlack,
		fontWeight: "bold"
	},
	subTitle: {
		marginTop: 5,
		fontSize: 15,
		color: colors.textBlack
	},
	inputStyle: {
		width: accountWidth,
		marginTop: 25
	},
	link: {
		fontSize: 15,
		color: colors.primaryBlue,
		marginTop: 15
	},
	btnStyle: {
		width: accountWidth,
		marginTop: 15	
	},
	footer: {
		width: accountWidth
	},

	infoContent: {
		width: W50,
	},
	infoTitle: {
		fontSize: 25,
		fontWeight: 600,
		color: colors.textBlack
	},
	infoSubTitle: {
		marginTop: 10,
		fontSize: 16,
		color: colors.holderColor,
		fontWeight: 300
	},
	hr: {
		width: W50,
		marginVertical: 40,
		height: 1,
		backgroundColor: colors.borderColor
	},

	featureRow: {
		width: W50,
		marginTop: 40,
		flexDirection: "row",
		borderRadius: BORDER_RADIUS,
		borderColor: colors.borderColor,
		borderWidth: 1,
		alignItems: 'center',
	},
	featureImageCover: {
		width: 120,
		height: 120,
		// borderRadius: BORDER_RADIUS,
		// borderColor: colors.borderColor,
		// borderWidth: 1,
		marginRight: 20,
		justifyContent: "center",
		alignItems: "center"
	},
	featureImage: {
		width: 80,
		height: 80
	},
	featureTitle: {
		fontSize: 20,
		fontWeight: 600,
		color: colors.textBlack,
		marginBottom: 10
	},
	featureSubtitle: {
		fontSize: 16,
		color: colors.holderColor,
		width: W40,
		fontWeight: 300
	}
};

export default style;
