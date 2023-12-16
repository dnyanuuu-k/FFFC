import { StyleSheet } from 'react-native';
import { WINDOW_WIDTH, BUTTON_HEIGHT } from 'utils/constants';
import { fonts } from 'themes/topography';

export const LOGO_SIZE = 90;
export const TOP_GAP = 20;
export const TOP_GAP2 = 10;
export const W73 = WINDOW_WIDTH * 0.73;
export const formWidth = WINDOW_WIDTH - WINDOW_WIDTH * 0.1;
export const coverWidth = WINDOW_WIDTH - WINDOW_WIDTH * 0.05;
export const formWidthInput = formWidth;
export const formWidthRadio = formWidth / 2.5;
export const coverHeight = (formWidth * 1) / 3;

export const sharedStyle = StyleSheet.create({
	modalInput: {
		width: '100%',
		height: BUTTON_HEIGHT,
		marginTop: TOP_GAP2,
		fontSize: fonts.regular,
	},
	optionInput: {
		height: BUTTON_HEIGHT,
		width: formWidthInput,
		marginTop: TOP_GAP2,
	},
	heightFix: {
		height: 30,
	},
	addButton: { fontSize: 14, fontWeight: 400 },
	marginFix: { marginRight: 20 },
	validFont: { fontSize: fonts.regular },
	buttonTxt: { fontSize: fonts.regular, fontWeight: 400 },
});