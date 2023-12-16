import { StyleSheet } from "react-native";
import {
	WINDOW_WIDTH,
	FESTIVAL_HEADER_HEIGHT,
	BUTTON_FORM_HEIGHT,
	WINDOW_HEIGHT,
	W90,
	W50,
	W30,
	BORDER_RADIUS,
} from "utils/constants";
import colors from "themes/colors";
import shadows from "themes/shadows";
const headerContentHeight = WINDOW_WIDTH / 3;
const profileSize = headerContentHeight / 2;
const profileTop = profileSize + FESTIVAL_HEADER_HEIGHT;
const titlePosition = profileSize - FESTIVAL_HEADER_HEIGHT * 2;

const SECTION_TITLE_FONTSIZE = 20;
const FONT20 = 20;
const FONT15 = 15;
const FONT22 = 22;
const FONT18 = 18;

const SECTION_RADIUS = 8;
const TOP_GAP = 20;
const TOP_GAP2 = 10;
const profileLeft = WINDOW_WIDTH - W90;
const organizerWidth = W50 / 3.5;
const mapViewSize = {
	width: 230,
	height: 120,
};
export const photoRowSize = W50 / 6;
export const albumRowSize = W50 / 5;
const style = StyleSheet.create({
	//Main Styles
	main: {
		width: WINDOW_WIDTH,
		height: WINDOW_HEIGHT,
		backgroundColor: colors.vectorBaseDip,
		overflowY: "auto",
		overflowX: "hidden",
	},
	headerBody: {
		height: headerContentHeight,
		width: WINDOW_WIDTH,
	},
	headerContent: {
		height: headerContentHeight,
		width: WINDOW_WIDTH,
		position: "absolute",
	},
	profileContent: {
		height: profileSize,
		width: WINDOW_WIDTH,
		top: profileTop,
		position: "absolute",
		flexDirection: "row",
	},
	profileImage: {
		borderWidth: 5,
		boxShadow: shadows.material,
		marginLeft: profileLeft,
		bottom: 10,
		backgroundColor: colors.vectorBase,
		borderRadius: profileSize,
		overflow: "hidden",
		borderColor: colors.popupBg,
		width: profileSize,
		height: profileSize,
		zIndex: 10,
	},
	name: {
		fontSize: 32,
		top: titlePosition,
		left: 20,
		fontWeight: "600",
		color: colors.wht,
	},
	tabContent: {
		borderBottomWidth: 1,
		borderColor: colors.borderGrey,
		backgroundColor: colors.popupBg,
		width: WINDOW_WIDTH,
		bottom: 0,
		height: FESTIVAL_HEADER_HEIGHT,
		position: "absolute",
		flexDirection: "row",
		alignItems: "flex-end",
		justifyContent: "center",
	},
	tab: {
		outline: "none",
		marginRight: 20,
		height: 40,
		minWidth: 70,
		marginHorizontal: 20,
	},
	tabText: {
		fontSize: FONT18,
		textAlign: "center",
	},
	tabSelected: {
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		position: "absolute",
		bottom: 0,
		width: "100%",
		height: 5,
		backgroundColor: colors.primaryBlue,
	},
	tabButton: {
		width: 150,
		height: 40,
		marginRight: 10
	},
	endOptions: {
		height: FESTIVAL_HEADER_HEIGHT,
		flexDirection: "row",
		position:"absolute",
		bottom: 0,
		right: 0,
		alignItems: "center",		
	},
	//Section Styles
	content: {
		paddingHorizontal: 20,
		marginTop: 80,
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center"		
	},
	contentSmall: {
		width: W30,
		marginHorizontal: TOP_GAP2,
	},
	contentLarge: {
		width: W50,
		marginHorizontal: TOP_GAP2,
	},
	section: {
		borderRadius: SECTION_RADIUS,
		borderWidth: 1,
		borderColor: colors.borderGrey,
		padding: TOP_GAP,
		backgroundColor: colors.popupBg,
		marginBottom: TOP_GAP,
		overflow: "hidden",
	},
	sectionTitle: {
		fontSize: SECTION_TITLE_FONTSIZE,
		fontWeight: "600",
		color: colors.primaryBlue,
		marginBottom: TOP_GAP2,
	},
	sectionRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: 'center'
	},
	sectionHr: {
		backgroundColor: colors.borderGrey,
		marginBottom: TOP_GAP2,
		height: 1,
		width: "100%",
	},
	contentText: {
		fontSize: "100%",
		color: colors.textBlack,
		fontWeight: "300",
		marginVertical: 20,
	},
	overflowCover: {
		height: FESTIVAL_HEADER_HEIGHT,
		width: "100%",
		position: "absolute",
		bottom: 0,
	},
	readMoreText: {
		fontSize: FONT15,
		fontWeight: "600",
		color: colors.primaryBlue,
	},
	spread: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		outline: "none",
	},
	sectionTab: {
		outline: "none",
		marginRight: 20,
		height: 40,
		minWidth: 70,
		marginHorizontal: 20,
	},
	sectionTabIcon: {
		width: 40,
		height: 40,
		paddingTop: 2,
		outline: 'none'
	},
	tabSectionCover: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	tabSectionRow: {
		flexDirection: "row",
		alignItems: "flex-end",
	},
	sectionTabButtons: {
		flexDirection: "row",
	},
	//Timeline Styles
	timeline: {
		width: "100%",
		alignItems: "center",
	},
	timeCard: {
		height: 80,
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	timeDate: {
		fontSize: FONT15,
		fontWeight: "500",
		width: "40%",
		textAlign: "right",
	},
	timeBar: {
		backgroundColor: colors.vectorBaseDip,
		height: 80,
		width: 5,
		marginHorizontal: TOP_GAP,
		justifyContent: "center",
		alignItems: "center",
	},
	timeBall: {
		width: 10,
		height: 10,
		borderRadius: 30,
	},
	timeText: {
		width: "50%",
	},
	timeSubText: {
		fontSize: 14,
		color: colors.holderColor,
		fontWeight: "300",
		marginTop: 5,
	},
	//Category Styles
	categoryCard: {
		height: BUTTON_FORM_HEIGHT,
		width: "100%",
		alignItems: "center",
		justifyContent: "space-between",
		flexDirection: "row",
	},
	categoryText: {
		fontSize: "100%",
		fontWeight: "400",
		color: colors.textBlack,
	},
	//PhotoRow Styles
	photoRow: {
		flexDirection: "row",
		marginVertical: TOP_GAP2,
		height: photoRowSize,
		width: "100%",
	},
	photoCover: {
		width: photoRowSize,
		height: photoRowSize,
		borderRadius: BORDER_RADIUS,
		overflow: "hidden",
		marginRight: TOP_GAP,
	},
	photoView: {
		width: photoRowSize,
		height: photoRowSize,
	},
	photoMoreHolder: {
		backgroundColor: colors.bgTrans,
		width: photoRowSize,
		height: photoRowSize,
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
	},
	photoMoreText: {
		fontSize: FONT22,
		fontWeight: "bold",
		color: colors.buttonTxt,
	},
	//Organizer Styles
	organizerCover: {
		width: organizerWidth,
		marginRight: TOP_GAP,
		height: 60,
		justifyContent: "center",
	},
	organizerName: {
		fontSize: FONT20,
		color: colors.textBlack,
		fontWeight: "300",
	},
	organizerDesignation: {
		fontSize: FONT15,
		color: colors.holderColor,
		marginTop: 5,
		fontWeight: "500",
	},
	organizerRow: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	//Contact Styles
	contactRow: {
		flexDirection: "row",
	},
	contactMapView: {
		width: mapViewSize.width,
		height: mapViewSize.height,
	},
	contactContent: {
		width: "50%",
	},
	contactAddress: {
		fontSize: FONT15,
		color: colors.primaryBlue,
		fontWeight: "500",
		marginTop: TOP_GAP,
	},
	contactSubAddress: {
		fontSize: FONT15,
		color: colors.holderColor,
		fontWeight: "300",
		marginTop: 5,
	},
	linkRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: TOP_GAP2,
	},
	linkIcon: {
		width: 30,
		height: 30,
		justifyContent: "center",
		alignItems: "center",
	},
	link: {
		color: colors.primaryBlue,
		fontWeight: "500",
		justifyContent: "center",
		fontSize: FONT15,
		marginLeft: TOP_GAP,
	},
	//Venue Styles
	venueRow: {
		flexDirection: "row",
		marginTop: 10,
		marginBottom: 5,
	},
	venueButton: {
		width: 140,
		height: 30,
		marginRight: TOP_GAP2,
	},
	venueButtonText: {
		fontSize: 14,
	},
	venueContent: {
		marginLeft: TOP_GAP,
	},
	venueMap: {
		width: mapViewSize.width,
		height: mapViewSize.height,
	},
	venueTitle: {
		fontSize: FONT15,
		color: colors.primaryBlue,
		fontWeight: "500",
	},
	venueSubTitle: {
		fontSize: FONT15,
		color: colors.holderColor,
		fontWeight: "300",
		marginTop: 5,
	},
});

export default style;
