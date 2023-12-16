import { Dimensions } from "react-native";

//Dimension Constants
const { width, height } = Dimensions.get("window");

export const WINDOW_WIDTH = width;
export const WINDOW_HEIGHT = height;
export const WINDOW_HALF_HEIGHT = height / 2;
export const WINDOW_HALF_WIDTH = width / 2;

export const LOGO_WIDTH = 159;
export const LOGO_HEIGHT = 35;
export const BORDER_RADIUS = 5;
export const MENU_BORDER_RADIUS = 15;
export const MENU_PADDING = 5;
export const HEADER_HEIGHT = 50;
export const FESTIVAL_HEADER_HEIGHT = 60;
export const FESTIVAL_TITLE_FONTSIZE = 20;

export const BUTTON_HEIGHT = 50;
export const BUTTON_FORM_HEIGHT = 42;
export const FOOTER_BUTTON_SM_HEIGHT = 35;
export const MODAL_TITLE_FONT_SIZE = 18;
export const FORM_FONT_SIZE = 15;
export const FORM_SM_FONT_SIZE = 13;
export const CONTENT_HEIGHT = WINDOW_HEIGHT - HEADER_HEIGHT;

export const PAGE_TITLE_FONT_SIZE = 22;
export const PAGE_SUB_TITLE_FONT_SIZE = 16;

export const TOP_GAP10 = 10;

export const W05 = WINDOW_WIDTH * 0.05;
export const W10 = WINDOW_WIDTH * 0.1;
export const W22 = WINDOW_WIDTH * 0.22;
export const W24 = WINDOW_WIDTH * 0.24;
export const W27 = WINDOW_WIDTH * 0.27;

export const W30 = WINDOW_WIDTH * 0.3;
export const W35 = WINDOW_WIDTH * 0.35;

export const W40 = WINDOW_WIDTH * 0.4;
export const W45 = WINDOW_WIDTH * 0.45;

export const W50 = WINDOW_WIDTH * 0.5;
export const W55 = WINDOW_WIDTH * 0.55;

export const W60 = WINDOW_WIDTH * 0.6;
export const W65 = WINDOW_WIDTH * 0.65;
export const W66 = WINDOW_WIDTH * 0.66;

export const W70 = WINDOW_WIDTH * 0.7;
export const W75 = WINDOW_WIDTH * 0.75;

export const W80 = WINDOW_WIDTH * 0.8;
export const W85 = WINDOW_WIDTH * 0.85;

export const W90 = WINDOW_WIDTH * 0.9;
export const W95 = WINDOW_WIDTH * 0.95;

export const SIDEBAR_FULL_WIDTH = 250;
export const SIDEBAR_SMALL_WIDTH = 60;
export const NAV_HEADER_HEIGHT = 60;
export const FULLBAR_WIDTH = WINDOW_WIDTH - SIDEBAR_FULL_WIDTH;
export const CONTENT_HEIGHT2 = WINDOW_HEIGHT - NAV_HEADER_HEIGHT;

//Site Constants
const ip = "localhost";
export const API_URL = `http://${ip}:3301/v1/`;
export const STATIC_URL = `http://${ip}:9000/`;

//Text Constants
export const HOST_NAME = window.location.hostname;
export const ERROR_TEXT = "Please try again!";
export const RELOAD_TEXT = "Please refresh page";
export const MMMMDDYYYY = "MMMM DD, YYYY";
export const DD = "DD";
export const DDMMYYYY = "DD MM YYYY";
export const YYYYMMDD = "YYYY-MM-DD";

// Aspect Ratios
export const THUMB_IMAGE_AR = 0.7142857142857143;

// Secret : Don't Edit
export const XRT = "9#xn$$x1";

// Update Request Types
export const REQUEST_NAME_CHANGE = 0;

export const RUNTIME_OPTIONS = [
	{
		label: "Any",
		value: "ANY",
	},
	{
		label: "Between",
		value: "BETWEEN",
	},
	{
		label: "Over",
		value: "OVER",
	},
];

export const GENDER_OPTIONS = [
	{
		label: "Male",
		value: "male",
	},
	{
		label: "Female",
		value: "female",
	},
	{
		label: "Other",
		value: "other",
	},
];

export const razorpayAPIKey = "rzp_test_Cfu49SWrDfnYz1";
export const paypalOptions = {
	"client-id": "AVZIr1O57PbImINJIypzT8IGNYR_m3jf1ecU6pF6zlq3uK2dQxlbl8-N-RhpJAaL2NYa8TgA86mYtrMs",
};