import {
	PAGE_SUB_TITLE_FONT_SIZE,
	FOOTER_BUTTON_SM_HEIGHT,
	PAGE_TITLE_FONT_SIZE,
	BUTTON_FORM_HEIGHT,
	FORM_SM_FONT_SIZE,
	FORM_FONT_SIZE,
	BUTTON_HEIGHT,
	BORDER_RADIUS,
	CONTENT_HEIGHT,
	WINDOW_WIDTH,
	W27,
	W50,
} from "utils/constants";
import colors from "themes/colors";

const LOGO_SIZE = 130;
const TOP_GAP = 20;
const TOP_GAP2 = 10;
const sectionContentWidth = W27 - W27 * 0.1;
const W73 = WINDOW_WIDTH * 0.73;
const tabButtonWidth = sectionContentWidth - (BUTTON_HEIGHT + 10);
const formWidth = W50 - W50 * 0.1;
const formSideGap = W50 * 0.23;
const formWidthInput = formWidth / 2.5;
const formWidthRadio = formWidth / 3.5;
const coverHeight = (formWidth * 1) / 3;

const note = {
	color: colors.primaryBlue,
	marginLeft: 10,
	fontSize: 12,
	fontWeight: 400,
	cursor: "pointer",
};

const style = {
	row: { flexDirection: "row" },
	sectionHolder: {
		width: W27,
		borderRightWidth: 1,
		borderColor: colors.borderColor,
		height: CONTENT_HEIGHT,
		alignItems: "center",
	},
	contentHolder: {
		backgroundColor: colors.cementBg,
		height: CONTENT_HEIGHT,
		alignItems: "center",
		width: W73,
	},
	formHolder: {
		borderColor: colors.borderColor,
		width: W50,
		borderRightWidth: 1,
		borderLeftWidth: 1,
		minHeight: CONTENT_HEIGHT,
		backgroundColor: colors.popupBg,
		paddingBottom: 20,
	},
	title: {
		marginTop: TOP_GAP,
		width: sectionContentWidth,
		fontSize: PAGE_TITLE_FONT_SIZE,
		fontWeight: "bold",
		color: colors.textBlack,
	},
	subTitle: {
		marginTop: TOP_GAP2,
		width: sectionContentWidth,
		fontSize: PAGE_SUB_TITLE_FONT_SIZE,
		fontWeight: 400,
		color: colors.holderColor,
	},
	tabCard: {
		height: BUTTON_HEIGHT,
		width: sectionContentWidth,
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: TOP_GAP,
		outline: "none",
		alignItems: "center",
	},
	tabSr: {
		height: BUTTON_FORM_HEIGHT,
		width: BUTTON_FORM_HEIGHT,
		borderRadius: 100,
		justifyContent: "center",
		alignItems: "center",
	},
	tabButton: {
		borderWidth: 1,
		borderRadius: BORDER_RADIUS,
		width: tabButtonWidth,
		height: BUTTON_HEIGHT,
		justifyContent: "center",
		paddingLeft: 10,
	},
	tabSRText: {
		fontSize: 16,
		fontWeight: 600,
	},
	tabText: {
		fontSize: 18,
		fontWeight: 500,
	},
	footerButton: {
		position: "absolute",
		bottom: 0,
		width: W27,
		height: BUTTON_HEIGHT,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.greenDark,
	},
	footerButtonText: {
		fontSize: 18,
		color: colors.buttonTxt,
	},
	backTopCover: {
		width: formSideGap,
		position: "absolute",
		bottom: 0,
		right: 0,
		outline: "none",
		height: 100,
		justifyContent: "center",
		alignItems: "center",
	},
	backTopText: {
		fontSize: FORM_FONT_SIZE,
		color: colors.holderColor,
		fontWeight: 500,
		marginVertical: 10,
		textAlign: "center",
	},
};

export const festivalDetailStyles = {
	tooltip: {
		...note,
		cursor: 'help'
	},
	main: {
		alignSelf: "center",
		width: formWidth,
	},
	title: {
		marginTop: TOP_GAP,
		width: formWidth,
		fontSize: PAGE_TITLE_FONT_SIZE,
		fontWeight: "bold",
		color: colors.textBlack,
	},
	subTitle: {
		marginTop: TOP_GAP2,
		width: formWidth,
		fontSize: PAGE_SUB_TITLE_FONT_SIZE,
		fontWeight: 400,
		color: colors.holderColor,
	},
	fieldTitle: {
		color: colors.textBlack,
		fontWeight: 500,
		marginTop: TOP_GAP,
		fontSize: 15,
	},
	coverHolder: {
		backgroundColor: colors.vectorBase,
		borderColor: colors.borderColor,
		borderRadius: BORDER_RADIUS,
		width: formWidth,
		marginTop: TOP_GAP,
		marginBottom: TOP_GAP,
		borderWidth: 1,
		height: coverHeight,
	},
	cover: {
		borderRadius: BORDER_RADIUS,
		width: formWidth,
		height: coverHeight,
	},
	uploadCoverBtn: {
		height: 30,
		position: "absolute",
		top: 10,
		right: 10,
		flexDirection: "row",
		borderRadius: BORDER_RADIUS,
		backgroundColor: colors.bgTrans,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 10,
	},
	uploadText: {
		paddingLeft: 10,
		fontSize: FORM_SM_FONT_SIZE,
		color: colors.buttonTxt,
		fontWeight: "500",
	},
	logoHolder: {
		width: LOGO_SIZE,
		height: LOGO_SIZE,
		borderRadius: 100,
		position: "absolute",
		bottom: -26,
		left: 10,
		backgroundColor: colors.popupBg,
		borderWidth: 2,
		borderColor: colors.borderColor,
		overflow: "hidden",
		alignItems: "center",
	},
	logo: {
		width: LOGO_SIZE,
		height: LOGO_SIZE,
	},
	logoBtn: {
		width: 35,
		height: 35,
		borderRadius: 100,
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		bottom: 10,
		backgroundColor: colors.bgTrans,
	},
	input: {
		height: BUTTON_FORM_HEIGHT,
		width: formWidth,
		marginTop: TOP_GAP2,
		fontSize: FORM_FONT_SIZE,
	},
	inputHalf: {
		height: BUTTON_FORM_HEIGHT,
		width: formWidthInput,
		marginTop: TOP_GAP2,
		fontSize: FORM_FONT_SIZE,
	},
	inputThird: {
		height: BUTTON_FORM_HEIGHT,
		width: formWidthRadio,
		marginTop: TOP_GAP2,
		fontSize: FORM_FONT_SIZE,
		marginRight: TOP_GAP2
	},
	validFont: {
		fontSize: FORM_FONT_SIZE
	},
	validMargin: {
		marginTop: TOP_GAP2
	},
	inputRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		alignItems: "center"
	},
	inputArea: {
		fontSize: FORM_FONT_SIZE,
		paddingTop: TOP_GAP2,
		minHeight: 150,
		width: formWidth,
		marginTop: TOP_GAP2,
	},
	required: {
		color: colors.rubyRed,
	},
	radio: {
		height: BUTTON_FORM_HEIGHT,
		width: formWidthInput,
		marginTop: TOP_GAP2,
		marginRight: TOP_GAP2,
	},
	radioThird: {
		height: BUTTON_FORM_HEIGHT,
		width: formWidthRadio,
		marginTop: TOP_GAP2,
		marginRight: TOP_GAP2,
	},
	button: {
		width: formWidthInput,
		height: BUTTON_FORM_HEIGHT,
		marginTop: TOP_GAP,
		alignSelf: "flex-end",
	},
	buttonTxt: { fontSize: FORM_FONT_SIZE, fontWeight: 400 },
	previewButton: {
		height: BUTTON_FORM_HEIGHT,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
		width: 140,
		borderRadius: BORDER_RADIUS,
		backgroundColor: colors.vectorBase,
		borderColor: colors.vectorBaseDip,
		borderWidth: 1,
		position: "absolute",
		outline: "none",
		right: 0,
		top: TOP_GAP,
	},
	previewText: {
		fontSize: FORM_FONT_SIZE,
		fontWeight: 500,
		marginLeft: 10,
		color: colors.textBlack,
	},
	titleButton: {
		marginTop: TOP_GAP2,
		height: 30,
		width: 150,
	},
	modalInput: {
		width: "100%",
		height: BUTTON_FORM_HEIGHT,
		marginTop: TOP_GAP2,
		fontSize: FORM_FONT_SIZE,
	},
	textHr: {
		fontSize: FORM_FONT_SIZE,
		color: colors.textBlack,
		marginHorizontal: 10
	},
	urlText: {
		marginRight: TOP_GAP2,
		marginTop: TOP_GAP2,
		fontSize: FORM_FONT_SIZE,
		color: colors.primaryBlue
	},
	note,
};

export const manageCategoryStyles = {
	note: {
		fontSize: FORM_FONT_SIZE,
		color: colors.rubyRed,
		fontWeight: '500',
		marginVertical: 10
	},
	bold: {
		fontWeight: "bold"
	},
	card: {
		borderRadius: BORDER_RADIUS,
		borderColor: colors.borderColor,
		borderWidth: 1,
		padding: 10,
		marginTop: TOP_GAP2,
		width: "100%"
	},
	title: {
		fontSize: 16,
		color: colors.textBlack,
		fontWeight: '300'
	},
	subText: {
		fontSize: FORM_SM_FONT_SIZE,
		color: colors.primaryBlue,
		marginTop: 3
	},
	optionRow: {
		flexDirection: "row"
	},
	inputRow: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: TOP_GAP2,
		marginRight: TOP_GAP2
	},
	feeInput: {
		width: 70,
		height: FOOTER_BUTTON_SM_HEIGHT,
		marginLeft: 5
	},
	timeInput: {
		width: 70,
		height: BUTTON_FORM_HEIGHT,
		marginRight: 5
	},
	optionInput: {
		width: 150,
		height: BUTTON_FORM_HEIGHT,
		marginRight: 5
	},
	label: {
		fontSize: FORM_SM_FONT_SIZE,
		color: colors.textBlack,
		marginRight: 5
	},
	inputArea: {
		fontSize: FORM_FONT_SIZE,
		paddingTop: TOP_GAP2,
		minHeight: 100,
		width: "100%",
		marginTop: TOP_GAP2,
	},
}

export default style;