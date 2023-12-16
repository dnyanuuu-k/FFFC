const rubyRed = '#E02020';
const primaryBlue = '#0B66C2';
//Direct Import Default Common Colors
const defaultColors = {
	vimeo: '#1ab7ea',
	youtube: '#ff0000',
	gold: '#d0aa45',
	borderGrey: '#E7E7E7',
	vectorBaseDip: '#dfe3ec',
	textLight: '#666666',
	primaryLight: '#0B66C221',
	holderColor: '#86888A',
	buttonTxt: '#FFF',
	popupBg: '#FFF',
	blk: '#000000',
	greenLight: '#279C7021',
	greenDark: '#279C70',
	green: '#2DB482',
	cementBg: '#ECEDED',
	darkCement: '#b0b6bc',
	rubyRedLight: '#E0202021',
	darkOrange: '#C7570D',
	bgTrans: '#000000b4',
	bgTrans69: '#00000069',
	bgTransd1: '#000000d1',
	bgTrans21: '#00000021',
	menuBackground: '#ffffffbb',
	transparent: '#00000000',
	primaryBlue,
	rubyRed,
};

export const DarkTheme = {
	dark: true,
	colors: {
		primary: primaryBlue,
		card: '#222222',
		cardLight: '#141414b4',
		text: '#e1e3e6',
		background: '#141414',
		notification: rubyRed,
		border: '#333333',

		selected: '#e1e3e6',
		shimmerColor: '#404040',

		...defaultColors,
	},
};

export const LightTheme = {
	dark: false,
	colors: {
		primary: primaryBlue,
		card: '#ffffff',
		cardLight: '#ffffffb4',
		text: '#333333',
		background: '#EFF2F5',
		notification: rubyRed,
		border: '#E6E6E6',
		selected: '#000000',
		shimmerColor: '#cccccc',
		...defaultColors,
	},
};

export default defaultColors;