import { StyleSheet } from "react-native";
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

const TOP_GAP = 20;
const TOP_GAP2 = 10;
const sectionContentWidth = W27 - W27 * 0.1;
const W73 = WINDOW_WIDTH * 0.73;
const tabButtonWidth = sectionContentWidth - (BUTTON_HEIGHT + 10);
const formWidth = W50 - W50 * 0.1;
const formSideGap = W50 * 0.23;
const formWidthInput = formWidth / 2.5;
const formWidthRadio = formWidth / 3.5;
const formMainStyle = {
	alignSelf: "center",
	width: formWidth,
};
const filmCreditCardHeight = 80;

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
		paddingLeft: 10,
		borderRadius: BORDER_RADIUS,
		width: sectionContentWidth,
		height: BUTTON_HEIGHT,
		marginTop: TOP_GAP,
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

export const festivalDetailStyles = StyleSheet.create({
	main: formMainStyle,
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
		marginRight: TOP_GAP2,
	},
	validFont: {
		fontSize: FORM_FONT_SIZE,
	},
	validMargin: {
		marginTop: TOP_GAP2,
	},
	inputRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		alignItems: "center",
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
	textHr: {
		fontSize: FORM_FONT_SIZE,
		color: colors.textBlack,
		marginHorizontal: 10,
	},
	urlText: {
		marginRight: TOP_GAP2,
		marginTop: TOP_GAP2,
		fontSize: FORM_FONT_SIZE,
		color: colors.primaryBlue,
	},
	note,

	checkboxInput: {
		paddingLeft: 0,
	},
	checkboxText: {
		fontSize: FORM_FONT_SIZE,
		color: colors.textLight,
	},
	checkboxCover: {
		marginTop: TOP_GAP,
		padding: TOP_GAP,
		borderColor: colors.borderColor,
		borderWidth: 1,
		borderRadius: BORDER_RADIUS,
	},
	optionInput: {
		height: BUTTON_FORM_HEIGHT,
		width: formWidthInput,
		marginTop: TOP_GAP2,
	},
});

export const manageCategoryStyles = StyleSheet.create({
	note: {
		fontSize: FORM_FONT_SIZE,
		color: colors.rubyRed,
		fontWeight: "500",
		marginVertical: 10,
	},
	bold: {
		fontWeight: "bold",
	},
	card: {
		borderRadius: BORDER_RADIUS,
		borderColor: colors.borderColor,
		borderWidth: 1,
		padding: 10,
		marginTop: TOP_GAP2,
		width: "100%",
	},
	title: {
		fontSize: 16,
		color: colors.textBlack,
		fontWeight: "300",
	},
	subText: {
		fontSize: FORM_SM_FONT_SIZE,
		color: colors.primaryBlue,
		marginTop: 3,
	},
	optionRow: {
		flexDirection: "row",
	},
	inputRow: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: TOP_GAP2,
		marginRight: TOP_GAP2,
	},
	feeInput: {
		width: 70,
		height: FOOTER_BUTTON_SM_HEIGHT,
		marginLeft: 5,
	},
	timeInput: {
		width: 70,
		height: BUTTON_FORM_HEIGHT,
		marginRight: 5,
	},
	label: {
		fontSize: FORM_SM_FONT_SIZE,
		color: colors.textBlack,
		marginRight: 5,
	},
	inputArea: {
		fontSize: FORM_FONT_SIZE,
		paddingTop: TOP_GAP2,
		minHeight: 100,
		width: "100%",
		marginTop: TOP_GAP2,
	},
});

export const creditManagerStyles = StyleSheet.create({
	main: {
		width: formWidth,
		borderWidth: 1,
		borderColor: colors.borderColor,
		borderRadius: BORDER_RADIUS,
		overflow: "hidden",
		marginTop: TOP_GAP,
	},
	creditSection: {
		width: formWidth,
		borderBottomWidth: 1,
		backgroundColor: colors.wht,
		borderColor: colors.borderColor,
	},
	creditCardCover: {
		paddingBottom: TOP_GAP,
		paddingHorizontal: TOP_GAP,		
	},
	personRow: {
		display: "flex",
		flexDirection: "row",
		flexWrap: "wrap"
	},
	creditSectionHeader: {
		width: formWidth,
		height: BUTTON_FORM_HEIGHT,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 10
	},
	creditSectionTitle: {
		fontSize: FORM_FONT_SIZE,
		fontWeight: '500'
	},
	buttonRow: {
		flexDirection: "row",
	},
	iconButton: {
		width: BUTTON_FORM_HEIGHT,
		height: BUTTON_FORM_HEIGHT,
		justifyContent: "center",
		alignItems: "center",
	},
	centerBox: {
		justifyContent: "center",
		alignItems: "center",
		height: BUTTON_FORM_HEIGHT,
		width: formWidth,
	},
	buttonText: {
		fontSize: FORM_FONT_SIZE,
		fontWeight: "500",
		color: colors.primaryBlue,
	},
	creditCard: {
		width: formWidthInput,
		height: filmCreditCardHeight,
		borderRadius: BORDER_RADIUS,
		borderColor: colors.borderColor,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
		marginTop: TOP_GAP,
		marginRight: TOP_GAP,
		flexDirection: "row",
		overflow: "hidden",
		backgroundColor: colors.wht
	},
	addPersonButton: {
		width: formWidthInput,
		height: filmCreditCardHeight,
		borderRadius: BORDER_RADIUS,
		justifyContent: 'center',
		alignItems: 'center',
		display: "flex",
		cursor: "pointer",
		border: `solid 1px ${colors.primaryBlue}`,
		marginTop: TOP_GAP,
		marginRight: TOP_GAP,
		flexDirection: "row",
		overflow: "hidden",
		backgroundColor: colors.wht
	},
	cardAvatarCover: {
		width: 70,
		height: filmCreditCardHeight,
		justifyContent: "center",
		alignItems: "center"
	},
	cardAvatar: {
		width: 60,
		height: 60,
		borderRadius: 100,
		backgroundColor: colors.vectorBase
	},
	cardContentCover: {
		flex: 1,
		justifyContent: "center"
	},
	cardName: {
		fontWeight: '500',
		fontSize: FORM_FONT_SIZE,
		color: colors.textBlack
	},
	cardDesc: {
		fontWeight: '300',
		fontSize: 12,
		marginTop: 3,
		color: colors.holderColor
	},
	cardLinked: {
		color: colors.greenDark
	},
	selected: {		
		borderColor: colors.primaryBlue,
	},
	cardButtons: {
		flexDirection: "row",
		backgroundColor: colors.bgTrans,
		alignItems: "center",
		justifyContent: "space-around",
		position: "absolute",
		top: 0,
		right: 0,
		width: 70,
		borderBottomLeftRadius: BORDER_RADIUS
	},
	cardButton: {
		width: 26,
		height: 26,
		alignItems: "center",
		justifyContent: "center",
	},
});

export default style;