import { captureScreen } from 'react-native-view-shot';

let changeListener = null;
let currentMode = 'light';

const DARK_MODE = 'dark';
const LIGHT_MODE = 'light';

const addListener = (listener) => {
	changeListener = listener;
};

const removeListener = () => {
	changeListener = null;
};

const setAppMode = (mode) => {
	if (changeListener) {
		currentMode = mode;
		captureScreen({}).then((uri) => {
			changeListener(uri, mode);
		});
	}
};

const getCurrentMode = () => {
	return currentMode;
};

const AppMode = {
	DARK_MODE,
	LIGHT_MODE,
	addListener,
	removeListener,
	setAppMode,
	getCurrentMode,
};

export default AppMode;
