//Constants
import {
	WINDOW_WIDTH,
	WINDOW_HEIGHT,
	CONTENT_HEIGHT,
	BORDER_RADIUS,
	W50,
	W60,
} from "utils/constants";
import colors from "themes/colors";

const footerHeight = 130;
const heightWithoutFooter = CONTENT_HEIGHT - footerHeight;
const contentHeight = heightWithoutFooter - heightWithoutFooter * 0.2;
const cardSize = W50 / 3.3;
const imageSize = cardSize - cardSize * 0.6;

const style = {
	main: {
		height: WINDOW_HEIGHT,
		width: WINDOW_WIDTH,
	},
	content: {
		height: heightWithoutFooter,
		width: WINDOW_WIDTH,
		justifyContent: "center",
		alignItems: "center",
	},
	mainContent: {
		height: contentHeight,
		width: W60,
	},
	title: {
		fontSize: 26,
		fontWeight: "bold",
		color: colors.textBlack,
		marginBottom: 10,
	},
	subTitle: {
		fontSize: 18,
		color: colors.textBlack,
		marginBottom: 30,
	},
	typeCover: {
		width: W60,
		justifyContent: "space-between",
		flexDirection: "row",
		marginBottom: 30,
	},
	card: {
		width: cardSize,
		height: cardSize,
		borderRadius: BORDER_RADIUS,
		marginBottom: 20,
		justifyContent: "center",
		alignItems: "center",
	},
	typeText: {
		fontSize: 18,
		color: colors.textBlack,
		fontWeight: "bold",
		width: cardSize,
		textAlign: "center"
	},
	btnStyle: {
		marginTop: 20,
		width: 200,
		alignSelf: "flex-end",
	},
	footer: {
		width: 300,
		justifyContent: "center",
		height: footerHeight,
		alignSelf: "center",
	},
	imageStyle: {
		height: imageSize,
		width: imageSize,
	},
};

export default style;