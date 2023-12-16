import { StatusBar, Dimensions } from 'react-native';

const undecided = require('assets/icons/hourglass.png');
const cancelled = require('assets/icons/cancel.png');
const selected = require('assets/icons/prize.png');
const winner = require('assets/icons/award.png');
const finalist = require('assets/icons/medal.png');
const nominee = require('assets/icons/starBox.png');
const honarableMention = require('assets/icons/heartBox.png');

//Dimension Constants
const { width, height } = Dimensions.get('window');

export const WINDOW_WIDTH = width;
export const WINDOW_HEIGHT = height + StatusBar.currentHeight;

export const BOTTOM_TAB_HEIGHT = 50;
export const MODAL_HEADER_HEIGHT = 50;
export const HEADER_HEIGHT = 50 + StatusBar.currentHeight;
export const SCREEN_HEIGHT =
	WINDOW_HEIGHT - (BOTTOM_TAB_HEIGHT + HEADER_HEIGHT);

export const W95 = width * 0.95;
export const W90 = width * 0.9;
export const W80 = width * 0.8;
export const W70 = width * 0.7;
export const W60 = width * 0.6;
export const W65 = width * 0.65;
export const W35 = width * 0.35;
export const W10 = width * 0.1;
export const H40 = height * 0.4;
export const H50 = height * 0.5;
export const H60 = height * 0.6;
export const H70 = height * 0.7;

export const BORDER_RADIUS = 5;
export const BUTTON_HEIGHT = 45;

export const FESTIVAL_CARD_HEIGHT = 238;

//Site Constants
const ip = '192.168.32.152';
export const API_URL = `http://${ip}:3301/v1/`;
export const STATIC_URL = `http://${ip}:9000/`;
export const TUS_URL = `${API_URL}tus`;
export const TINODE_URL = `${ip}:6060`;
export const HOST_NAME = 'filmfestbook.com';
export const BRAND_COLOR = '#0B66C2';

//Text Constants
export const ERROR_TEXT = 'Please try again!';
export const RELOAD_TEXT = 'Please refresh page';
export const MMMMDDYYYY = 'MMMM DD, YYYY';
export const MMMDDYYYY = 'MMM DD, YYYY';
export const DD = 'DD';
export const DDMMYYYY = 'DD MM YYYY';
export const MMDDYYYY = 'MM-DD-YYYY';
export const YYYYMMDD = 'YYYY-MM-DD';
export const MMMYYYY = 'MMM YYYY';
export const MMMMYYYY = 'MMMM YYYY';

// Aspect Ratios
export const THUMB_IMAGE_AR = 0.7142857142857143;
export const COVER_ASPECT_RATIO = 0.33333333333;
export const MAP_ASPECT_RATIO = 1.37634408602;
export const POSTER_IMAGE_RATIO = 0.675;

// Image Heights
export const COVER_IMAGE_HEIGHT = WINDOW_WIDTH * COVER_ASPECT_RATIO;

//Secret : Don't Edit
export const XRT = '9#xn$$x1';

// Update Request Types
export const REQUEST_NAME_CHANGE = 0;

export const RUNTIME_OPTIONS = [
	{
		label: 'Any',
		value: 'ANY',
	},
	{
		label: 'Between',
		value: 'BETWEEN',
	},
	{
		label: 'Over',
		value: 'OVER',
	},
];

export const GENDER_OPTIONS = [
	{
		label: 'Male',
		value: 'male',
	},
	{
		label: 'Female',
		value: 'female',
	},
	{
		label: 'Other',
		value: 'other',
	},
];

export const YESNO_OPTIONS = [
	{
		label: 'Yes',
		value: true,
	},
	{
		label: 'No',
		value: false,
	},
];

export const RAZORPAY_API_KEY = 'rzp_test_Cfu49SWrDfnYz1';
export const PAYPAL_CLIENT_ID =
	'AVZIr1O57PbImINJIypzT8IGNYR_m3jf1ecU6pF6zlq3uK2dQxlbl8-N-RhpJAaL2NYa8TgA86mYtrMs';

// Submission Status
export const SUBMISSION_IN_CONSIDERATION = 1;
export const SUBMISSION_INCOMPLETE = 0;
export const SUBMISSION_DISQUALIFIED = 2;
export const SUBMISSION_WITHDRAWN = 3;

// Judging Status Not Selected
export const JUDGE_UNDECIDED = {
	id: 0,
	color: '#86888A',
	icon: undecided,
	label: 'Undecided',
};
export const JUDGE_NOT_SELECTED = {
	id: 1,
	color: '#242424',
	icon: cancelled,
	label: 'Not Selected',
};

// Judging Status Selected
export const JUDGE_SELECTED = {
	id: 2,
	color: '#279C70',
	icon: selected,
	label: 'Selected',
};
export const JUDGE_AWARD_WINNER = {
	id: 3,
	color: '#d0aa45',
	icon: winner,
	label: 'Award Winner',
};
export const JUDGE_FINALIST = {
	id: 4,
	color: BRAND_COLOR,
	icon: finalist,
	label: 'Finalist',
};
export const JUDGE_SEMI_FINALIST = {
	id: 5,
	color: '#c43632',
	icon: finalist,
	label: 'Semi-Finalist',
};
export const JUDGE_QUATER_FINALIST = {
	id: 6,
	color: '#8a51c4',
	icon: finalist,
	label: 'Quater-Finalist',
};
export const JUDGE_NOMINEE = {
	id: 7,
	color: '#fcaf4d',
	icon: nominee,
	label: 'Nominee',
};
export const JUDGE_HONARABLE_MENTION = {
	id: 8,
	color: '#fb6064',
	icon: honarableMention,
	label: 'Honorable Mention',
};

// Video States
export const VIDEO_STATES = {
	NOTCREATED: null,
	CREATED: 'created',
	UPLOADING: 'uploading',
	UPLOADED: 'uploaded',
	TRANSCODING: 'transcoding',
	READY: 'ready',
	YOUTUBEVIDEO: 'yt',
	VIMEOVIDEO: 'vimeo',

	ERROR: 'err',
};
// TODO: Flag Names from Backend
export const DEFAULT_FLAGS = [
	{
		id: 1,
		title: 'Blue',
		color: '#65BBFC',
	},
	{
		id: 1,
		title: 'Red',
		color: '#FC6265',
	},
	{
		id: 1,
		title: 'Yellow',
		color: '#EBCF34',
	},
	{
		id: 1,
		title: 'Purple',
		color: '#D381F7',
	},
	{
		id: 1,
		title: 'Grey',
		color: '#C8C8C8',
	},
	{
		id: 1,
		title: 'Orange',
		color: '#FCB32A',
	},
	{
		id: 1,
		title: 'Black',
		color: '#111111',
	},
];

export const WORK_TYPE_MANAGE_FESTIVAL = 1;
export const WORK_TYPE_SUBMIT_WORK = 2;
export const WORK_TYPE_LIST = [
	{
		id: WORK_TYPE_SUBMIT_WORK,
		title: 'Film Maker',
		note: 'Submit films to festivals',
	},
	{
		id: WORK_TYPE_MANAGE_FESTIVAL,
		title: 'Festival Organizer',
		note: 'Create and manage film festivals for free',
	},
];

export const CHAT_COLORS = ['#22ABFF', '#4974DE'];
export const COVER = 0;
export const LOGO = 1;