import Snackbar from 'react-native-snackbar';
import colors from 'themes/colors';

const success = (text) => {
	Snackbar.show({
		text: text,
		duration: Snackbar.LENGTH_SHORT,
		backgroundColor: colors.greenDark,
		numberOfLines: 4,
	});
};

const error = (text) => {
	Snackbar.show({
		text: text,
		duration: Snackbar.LENGTH_LONG,
		backgroundColor: colors.rubyRed,
		numberOfLines: 4,
	});
};

const notify = (text, actionText) => {
	Snackbar.show({
		text: text,
		duration: Snackbar.LENGTH_LONG,
		backgroundColor: colors.primaryBlue,
		numberOfLines: 4,
		action: {
			text: 'Ok',
			onPress: () => {},
		},
	});
};

const Toast = {
	success,
	notify,
	error,
};

export default Toast;